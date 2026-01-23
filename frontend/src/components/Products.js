import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";

import Link from "next/link";
import { Button } from "./ui/button";

const Products = ({ products }) => {
  if (!products || !products.length)
    return (
      <div className="text-center py-36 md:py-56 lg:py-48">
        No product Found
      </div>
    );

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(220px,240px))] justify-center px-0.5 py-0.5 md:px-0 md:py-0">
      {Array.isArray(products) &&
        products.map((product) => {
          const outOfStock = product.stock === 0;

          return (
            <Card
              key={product._id}
              className="p-2 m-1.5 md:m-2.5 group transition-all hover:shadow-lg"
            >
              <CardHeader className="p-0 h-full">
                <Link href={`/shop/products/${product._id}`}>
                  <AspectRatio
                    ratio={1.5}
                    className="rounded-lg overflow-hidden"
                  >
                    <Image
                      src={product.imageURLs[0]}
                      fill
                      sizes="60vw"
                      alt="Image"
                      loading="lazy"
                      className="object-cover hover:scale-[1.1] transition-all duration-300"
                    />
                  </AspectRatio>
                </Link>
                <CardTitle>
                  <Link href={`/shop/products/${product._id}`}>
                    {product.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2">
                    <p className="text-lg text-foreground font-semibold">
                      ${product.discountPrice || product.price}
                    </p>
                    {product.discountPrice && (
                      <p className="text-muted-foreground line-through">
                        ${product.price}
                      </p>
                    )}
                  </div>
                </CardDescription>
                <CardContent className="p-0">
                  <Button
                    asChild
                    size="sm"
                    className="w-full"
                    disabled={outOfStock}
                  >
                    <Link href={`/shop/products/${product._id}`}>
                      {outOfStock ? "Out of Stock" : "View Product"}
                    </Link>
                  </Button>
                </CardContent>
              </CardHeader>
            </Card>
          );
        })}
    </div>
  );
};

export default Products;
