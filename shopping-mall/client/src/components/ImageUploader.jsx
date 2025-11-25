import { useRef, useEffect } from "react";
import "./ImageUploader.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function ImageUploader({
  images = { existing: [], pending: [] },
  onChange,
  maxImages = 5,
}) {
  const fileInputRef = useRef(null);
  const pendingRef = useRef(images.pending || []);

  const existingImages = images.existing || [];
  const pendingImages = images.pending || [];
  const totalImages = existingImages.length + pendingImages.length;

  useEffect(() => {
    pendingRef.current = pendingImages;
  }, [pendingImages]);

  useEffect(() => {
    return () => {
      pendingRef.current.forEach((item) => {
        if (item?.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = maxImages - totalImages;

    if (files.length > remainingSlots) {
      alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const nextPending = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 선택할 수 있습니다.");
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert("파일 크기는 10MB를 초과할 수 없습니다.");
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      nextPending.push({
        id: `${file.name}-${Date.now()}-${i}`,
        file,
        previewUrl,
      });
    }

    if (nextPending.length > 0) {
      onChange({
        existing: [...existingImages],
        pending: [...pendingImages, ...nextPending],
      });
    }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    const isExisting = index < existingImages.length;
    
    if (isExisting) {
      const updatedExisting = existingImages.filter((_, i) => i !== index);
      onChange({
        existing: updatedExisting,
        pending: [...pendingImages],
      });
    } else {
      const newIndex = index - existingImages.length;
      const removedItem = pendingImages[newIndex];
      if (removedItem?.previewUrl) {
        URL.revokeObjectURL(removedItem.previewUrl);
      }
      const updatedPending = pendingImages.filter((_, i) => i !== newIndex);
      onChange({
        existing: [...existingImages],
        pending: updatedPending,
      });
    }
  };

  const handleAddMore = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const canAddMore = totalImages < maxImages;
  const previewItems = [
    ...existingImages.map((url, index) => ({
      key: `existing-${index}`,
      url,
    })),
    ...pendingImages.map((item) => ({
      key: item.id,
      url: item.previewUrl,
      isPending: true,
    })),
  ];

  return (
    <div className="image-uploader">
      <div className="image-uploader-grid">
        {previewItems.map((item, index) => (
          <div key={item.key} className="image-uploader-item">
            <div className="image-uploader-preview">
              <img src={item.url} alt={`미리보기 ${index + 1}`} />
              {item.isPending && (
                <span className="image-uploader-pending-label">등록 대기</span>
              )}
              <button
                type="button"
                className="image-uploader-remove"
                onClick={() => handleRemoveImage(index)}
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
              disabled={!canAddMore}
            >
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
        disabled={!canAddMore}
      />

      <p className="image-uploader-help">
        최대 {maxImages}개의 이미지를 업로드할 수 있습니다. (각 10MB 이하)
      </p>
    </div>
  );
}

export default ImageUploader;

