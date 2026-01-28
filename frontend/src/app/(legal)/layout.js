export default function LegalLayout({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            Information
          </h3>
          <nav className="flex flex-col gap-4 text-sm font-medium text-muted-foreground">
            <a
              href="/shipping-info"
              className="hover:text-primary transition-colors"
            >
              Shipping Info
            </a>
            <a
              href="/refund-policy"
              className="hover:text-primary transition-colors"
            >
              Refund Policy
            </a>
            <a
              href="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 max-w-3xl space-y-12">{children}</main>
      </div>
    </div>
  );
}
