import ImageViewing from "react-native-image-viewing";
export default function ImagePreviewModal({
  show,
  onHide,
  images,
  imageIndex = 0,
}) {
  return (
    <ImageViewing
      images={images}
      imageIndex={imageIndex}
      visible={show}
      onRequestClose={onHide}
      animationType="fade"
    />
  );
}
