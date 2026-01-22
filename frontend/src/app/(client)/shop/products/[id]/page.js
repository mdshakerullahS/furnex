import SingleProduct from "@/components/SingleProduct";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function generateMetadata({ params }) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    credentials: "include",
  });

  const { product } = await res.json();
  return {
    title: product?.title,
    description: product?.description,
    openGraph: {
      type: "website",
      url: `${BASE_URL}/products/${id}`,
      title: product?.title,
      description: product?.description,
      siteName: "Furniro",
      images: [
        {
          url: product?.imageURLs[0],
          width: 1200,
          height: 630,
          alt: product?.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      creator: "@mdshakerullahS",
      images: [product?.imageURLs[0]],
      description: product?.description,
      title: product?.title,
    },
  };
}

const Page = async ({ params }) => {
  const { id } = await params;

  return <SingleProduct id={id} />;
};
export default Page;
