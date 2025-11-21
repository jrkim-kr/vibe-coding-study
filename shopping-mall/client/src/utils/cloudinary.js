/**
 * Cloudinary 이미지 업로드 유틸리티
 * 
 * 사용 전에 .env 파일에 다음 환경 변수를 설정하세요:
 * VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 * VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
 */

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ""
}/image/upload`;

/**
 * 이미지 파일을 Cloudinary에 업로드
 * @param {File} file - 업로드할 이미지 파일
 * @param {Function} onProgress - 업로드 진행률 콜백 (0-100)
 * @returns {Promise<string>} 업로드된 이미지 URL
 */
export const uploadImageToCloudinary = async (file, onProgress) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary 설정이 없습니다. VITE_CLOUDINARY_CLOUD_NAME과 VITE_CLOUDINARY_UPLOAD_PRESET을 .env 파일에 설정하세요."
    );
  }

  // 파일 유효성 검사
  if (!file) {
    throw new Error("파일이 선택되지 않았습니다.");
  }

  // 이미지 파일인지 확인
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드할 수 있습니다.");
  }

  // 파일 크기 제한 (10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error("파일 크기는 10MB를 초과할 수 없습니다.");
  }

  // FormData 생성
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "shopping-mall/products"); // 업로드 폴더 지정

  try {
    // XMLHttpRequest를 사용하여 진행률 추적
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.secure_url) {
              resolve(response.secure_url);
            } else {
              reject(new Error("업로드 응답에 이미지 URL이 없습니다."));
            }
          } catch (error) {
            reject(new Error("응답 파싱 중 오류가 발생했습니다."));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(
              new Error(
                errorResponse.error?.message || "이미지 업로드에 실패했습니다."
              )
            );
          } catch {
            reject(new Error(`업로드 실패: HTTP ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("네트워크 오류가 발생했습니다."));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("업로드가 취소되었습니다."));
      });

      xhr.open("POST", CLOUDINARY_UPLOAD_URL);
      xhr.send(formData);
    });
  } catch (error) {
    throw new Error(`이미지 업로드 중 오류: ${error.message}`);
  }
};

/**
 * 여러 이미지를 순차적으로 업로드
 * @param {File[]} files - 업로드할 이미지 파일 배열
 * @param {Function} onProgress - 전체 진행률 콜백 (0-100)
 * @param {Function} onFileProgress - 개별 파일 진행률 콜백 (fileIndex, percent)
 * @returns {Promise<string[]>} 업로드된 이미지 URL 배열
 */
export const uploadMultipleImages = async (
  files,
  onProgress,
  onFileProgress
) => {
  const totalFiles = files.length;
  const uploadedUrls = [];
  let completedFiles = 0;

  for (let i = 0; i < files.length; i++) {
    try {
      const url = await uploadImageToCloudinary(files[i], (percent) => {
        // 개별 파일 진행률
        if (onFileProgress) {
          onFileProgress(i, percent);
        }
        // 전체 진행률 계산
        if (onProgress) {
          const overallProgress = Math.round(
            ((completedFiles + percent / 100) / totalFiles) * 100
          );
          onProgress(overallProgress);
        }
      });
      uploadedUrls.push(url);
      completedFiles++;
    } catch (error) {
      throw new Error(`이미지 ${i + 1} 업로드 실패: ${error.message}`);
    }
  }

  return uploadedUrls;
};

