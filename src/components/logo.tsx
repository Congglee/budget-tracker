import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src={"/images/logo.png"}
      alt="Website logo"
      width={40}
      height={40}
      className="size-10 object-cover"
      sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
    />
  );
}
