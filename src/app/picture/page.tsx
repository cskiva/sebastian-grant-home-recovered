import Image from "next/image";

export default function Picture() {
  return (
    <div className="flex h-dvh w-screen items-center justify-center bg-black">
      <Image
        src="/img/picture.png"
        style={{ maxHeight: "100dvh", maxWidth: "100vw", width: "auto", height: "auto" }}
        width={1200}
        height={1900}
        alt="picture"
      />
    </div>
  );
}
