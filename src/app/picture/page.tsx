import Image from "next/image";

export default function Picture() {
  return (
    <div className="flex flex-1 items-center justify-center bg-background">
      <Image
        src="/img/picture.png"
        style={{ maxHeight: "100%", maxWidth: "100vw", width: "auto", height: "auto" }}
        width={1200}
        height={1900}
        alt="picture"
      />
    </div>
  );
}
