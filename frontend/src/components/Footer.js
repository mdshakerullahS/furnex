import Image from "next/image";
import Link from "next/link";
import logo from "../../public/Logo.png";
import { Mastercard, Visa, Paypal, Amex } from "react-payment-logos/dist/flat";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 text-left">
            <Link href="/" className="flex items-center gap-1">
              <Image
                src={logo}
                width={32}
                height={32}
                alt="Furniro Logo"
                className="w-auto"
              />
              <span className="text-xl font-bold">Furniro</span>
            </Link>
            <p className="max-w-64 text-sm text-muted-foreground">
              Beautiful furniture for modern homes. Comfort, quality, and style
              in every piece.
            </p>

            <div className="flex gap-4 pt-2">
              <Link href="#" aria-label="Facebook">
                <Facebook className="w-5 h-5 hover:text-primary transition" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="w-5 h-5 hover:text-primary transition" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="w-5 h-5 hover:text-primary transition" />
              </Link>
              <Link href="#" aria-label="YouTube">
                <Youtube className="w-5 h-5 hover:text-primary transition" />
              </Link>
            </div>
          </div>

          <div className="text-left">
            <h3 className="font-semibold mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-muted-foreground hover:text-primary"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/refund-policy"
                  className="text-muted-foreground hover:text-primary"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h3 className="font-semibold mb-3">We Accept</h3>
            <div className="flex gap-3 flex-wrap">
              <Visa />
              <Mastercard />
              <Paypal />
              <Amex />
            </div>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Furniro. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
