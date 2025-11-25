import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const requiredVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingVars = requiredVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.warn(
    `[Cloudinary] 환경 변수(${missingVars.join(
      ", "
    )})가 설정되지 않았습니다. 이미지 정리 기능이 비활성화됩니다.`
  );
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const extractPublicIdFromUrl = (url) => {
  if (!url) return null;

  try {
    const { pathname } = new URL(url);
    const segments = pathname.split("/").filter(Boolean);
    const uploadIndex = segments.indexOf("upload");

    if (uploadIndex === -1 || uploadIndex === segments.length - 1) {
      return null;
    }

    const publicIdSegments = segments.slice(uploadIndex + 1);
    if (
      publicIdSegments.length > 0 &&
      /^v\d+$/.test(publicIdSegments[0])
    ) {
      publicIdSegments.shift();
    }

    if (publicIdSegments.length === 0) {
      return null;
    }

    const publicIdWithExt = publicIdSegments.join("/");
    return publicIdWithExt.replace(/\.[^/.]+$/, "");
  } catch (error) {
    console.warn("[Cloudinary] public_id 추출 실패:", error.message);
    return null;
  }
};

export const deleteCloudinaryImages = async (imageUrls = []) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return { deleted: 0, errors: [] };
  }

  if (missingVars.length > 0) {
    console.warn("[Cloudinary] 환경 변수 미설정으로 삭제를 건너뜁니다.");
    return { deleted: 0, errors: ["Cloudinary config missing"] };
  }

  const publicIds = imageUrls
    .map((url) => extractPublicIdFromUrl(url))
    .filter(Boolean);

  if (publicIds.length === 0) {
    return { deleted: 0, errors: [] };
  }

  const results = await Promise.allSettled(
    publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
  );

  let deleted = 0;
  const errors = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value.result === "ok") {
      deleted += 1;
    } else if (result.status === "rejected") {
      errors.push({
        publicId: publicIds[index],
        message: result.reason?.message || "삭제 실패",
      });
    }
  });

  return { deleted, errors };
};

