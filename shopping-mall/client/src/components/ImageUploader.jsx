import { useState, useRef, useEffect } from "react";
import { uploadImageToCloudinary } from "../utils/cloudinary";
import "./ImageUploader.css";

function ImageUploader({ images = [], onChange, maxImages = 5 }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewUrls, setPreviewUrls] = useState(images);
  const fileInputRef = useRef(null);

  // 기존 이미지 URL과 새로 업로드할 파일을 구분
  const existingImages = images.filter((img) => typeof img === "string");
  const [newFiles, setNewFiles] = useState([]);

  // images prop이 변경될 때 previewUrls 업데이트
  useEffect(() => {
    setPreviewUrls(images);
  }, [images]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = maxImages - (existingImages.length + newFiles.length);

    if (files.length > remainingSlots) {
      alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileIndex = newFiles.length + i;

        // 파일 미리보기 생성
        const previewUrl = URL.createObjectURL(file);
        const tempFiles = [...newFiles, file];
        setNewFiles(tempFiles);
        setPreviewUrls([...previewUrls, previewUrl]);

        // Cloudinary에 업로드
        try {
          const uploadedUrl = await uploadImageToCloudinary(file, (progress) => {
            setUploadProgress((prev) => ({
              ...prev,
              [fileIndex]: progress,
            }));
          });

          // 업로드 성공 시 미리보기 URL을 실제 URL로 교체
          setPreviewUrls((prev) => {
            const updated = [...prev];
            updated[existingImages.length + fileIndex] = uploadedUrl;
            return updated;
          });

          uploadedUrls.push(uploadedUrl);
        } catch (error) {
          // 업로드 실패 시 해당 파일 제거
          setNewFiles((prev) => prev.filter((_, idx) => idx !== fileIndex));
          setPreviewUrls((prev) => {
            const updated = [...prev];
            updated.splice(existingImages.length + fileIndex, 1);
            return updated;
          });
          alert(`이미지 업로드 실패: ${error.message}`);
        }
      }

      // 모든 이미지 URL을 부모 컴포넌트에 전달
      const allImages = [...existingImages, ...uploadedUrls];
      onChange(allImages);
    } catch (error) {
      alert(`이미지 업로드 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress({});
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index) => {
    const isExisting = index < existingImages.length;
    
    if (isExisting) {
      // 기존 이미지 제거
      const updated = existingImages.filter((_, i) => i !== index);
      onChange(updated);
      setPreviewUrls(updated);
    } else {
      // 새로 업로드한 파일 제거
      const newIndex = index - existingImages.length;
      const updatedFiles = newFiles.filter((_, i) => i !== newIndex);
      const updatedUrls = previewUrls.filter((_, i) => i !== index);
      
      setNewFiles(updatedFiles);
      setPreviewUrls(updatedUrls);
      
      // 기존 이미지 + 남은 새 이미지 URL
      const allImages = [...existingImages, ...updatedUrls.slice(existingImages.length)];
      onChange(allImages);
    }
  };

  const handleAddMore = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const canAddMore = existingImages.length + newFiles.length < maxImages;

  return (
    <div className="image-uploader">
      <div className="image-uploader-grid">
        {previewUrls.map((url, index) => (
          <div key={index} className="image-uploader-item">
            <div className="image-uploader-preview">
              <img src={url} alt={`미리보기 ${index + 1}`} />
              {uploadProgress[index] !== undefined && (
                <div className="image-uploader-progress">
                  <div
                    className="image-uploader-progress-bar"
                    style={{ width: `${uploadProgress[index]}%` }}
                  />
                  <span className="image-uploader-progress-text">
                    {uploadProgress[index]}%
                  </span>
                </div>
              )}
              <button
                type="button"
                className="image-uploader-remove"
                onClick={() => handleRemoveImage(index)}
                disabled={uploading}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {canAddMore && (
          <div className="image-uploader-item">
            <button
              type="button"
              className="image-uploader-add"
              onClick={handleAddMore}
              disabled={uploading}
            >
              {uploading ? (
                <div className="image-uploader-spinner" />
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>이미지 추가</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: "none" }}
        disabled={uploading || !canAddMore}
      />

      {uploading && (
        <div className="image-uploader-status">
          이미지를 업로드하는 중...
        </div>
      )}

      <p className="image-uploader-help">
        최대 {maxImages}개의 이미지를 업로드할 수 있습니다. (각 10MB 이하)
      </p>
    </div>
  );
}

export default ImageUploader;

