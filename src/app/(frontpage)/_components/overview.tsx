import Image from "next/image";
import HeadingText from "@/components/heading-text";
import { ImageFrame } from "@/components/image-frame";

export default function Overview() {
  return (
    <section className="container py-12 lg:py-20" id="overview">
      <div className="flex flex-col gap-8 text-center">
        <HeadingText subtext="Get started with the app">
          Discover what you can do
        </HeadingText>
        <div className="grid grid-cols-1 gap-4 md:gap-8">
          <ImageFrame>
            <Image
              className="rounded-lg"
              src="https://utfs.io/f/rXMtqs6lu3kdTB8j8dSzeOpHvBJyc2mFwSbQY17LoC0IdVDK"
              width="1280"
              height="720"
              alt="Showcase image"
            />
          </ImageFrame>
          <ImageFrame>
            <Image
              className="rounded-lg"
              src="https://utfs.io/f/rXMtqs6lu3kdwjnKThe2V7mJOsKuryQ3vYlIdpzbHaAgLDfn"
              width="1280"
              height="720"
              alt="Showcase image"
            />
          </ImageFrame>
          <ImageFrame>
            <Image
              className="rounded-lg"
              src="https://utfs.io/f/rXMtqs6lu3kdgcdtL9z2l0VMhPqNt1yupOGe8KnLwHirjsfI"
              width="1280"
              height="720"
              alt="Showcase image"
            />
          </ImageFrame>
          <ImageFrame>
            <Image
              className="rounded-lg"
              src="https://utfs.io/f/rXMtqs6lu3kdCiCusIWaZqEDdhTWRNspAH95gi47vULG6oyk"
              width="1280"
              height="720"
              alt="Showcase image"
            />
          </ImageFrame>
          <ImageFrame>
            <Image
              className="rounded-lg"
              src="https://utfs.io/f/rXMtqs6lu3kdeke8YD7Suf0Wq2sIj5Rc4kHnJ1vbomhAUXgt"
              width="1280"
              height="720"
              alt="Showcase image"
            />
          </ImageFrame>
          <ImageFrame>
            <Image
              className="rounded-lg"
              src="https://utfs.io/f/rXMtqs6lu3kdasALX1QdLQGT2FezEK5ty3w0NYDbMIixcOUB"
              width="1280"
              height="720"
              alt="Showcase image"
            />
          </ImageFrame>
        </div>
      </div>
    </section>
  );
}
