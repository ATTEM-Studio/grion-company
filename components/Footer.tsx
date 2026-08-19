import { footer, nav } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-navy-deep py-14 text-white/60">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <p className="text-lg font-extrabold text-white">{footer.brand}</p>
            <p className="mt-1 text-sm text-white/45">{footer.brandKo}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/45">{footer.tagline}</p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <div>
              <p className="text-xs font-bold tracking-[0.15em] text-white/35">{footer.navTitle}</p>
              <ul className="mt-4 space-y-2.5">
                {nav.items.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="focus-ring text-sm text-white/60 hover:text-white">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.15em] text-white/35">{footer.contactTitle}</p>
              <p className="mt-4 text-sm text-white/60">{footer.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <div className="flex gap-5">
            {footer.legal.map((item) => (
              <span key={item} className="cursor-default">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
