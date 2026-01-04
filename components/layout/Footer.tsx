//compnents/layout/Footer.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaEnvelope } from "react-icons/fa";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(getCookie("js_role") === "admin");
  }, [pathname]);

  const isAdminRoute = pathname?.startsWith("/admin");

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.phone}?text=${encodeURIComponent(
    siteConfig.whatsapp.message
  )}`;

  const handleAdminClick = () => {
    if (isAdmin) {
      deleteCookie("js_role");
      setIsAdmin(false);
      router.replace("/admin/login");
      router.refresh();
      return;
    }
    router.push("/admin/login");
  };

  return (
    <footer className="border-t bg-background/60 backdrop-blur">
      <div className="container-page py-12 font-(family-name:--font-poppins)">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold">{siteConfig.name}</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Estudio de estética especializado en micropigmentación, cejas, pestañas y tratamientos faciales.
              Resultados naturales y prolijos.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">Contacto</p>

            <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <FaWhatsapp className="text-base" />
                WhatsApp
              </a>

              <a
                href="mailto:contacto@julietastudio.com"
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <FaEnvelope className="text-base" />
                contacto@julietastudio.com
              </a>

              <p className="text-xs">San Juan Capital, Argentina</p>
            </div>

            {/* Admin en mobile (no aparece dentro del panel /admin) */}
            {!isAdminRoute && (
              <div className="mt-5 md:hidden">
                <button
                  type="button"
                  onClick={handleAdminClick}
                  className="w-full rounded-2xl border bg-background/40 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-background/70 hover:text-foreground"
                >
                  {isAdmin ? "Cerrar sesión (Admin)" : "Panel Admin"}
                </button>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold">Seguinos</p>

            <div className="mt-4 flex items-center gap-4">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border bg-background/40 transition hover:bg-(--brand-pink-soft)/20"
              >
                <FaInstagram className="text-base" />
              </a>

              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border bg-background/40 transition hover:bg-(--brand-pink-soft)/20"
              >
                <FaFacebookF className="text-sm" />
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border bg-background/40 transition hover:bg-(--brand-pink-soft)/20"
              >
                <FaWhatsapp className="text-base" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <p>Hecho con cuidado y detalle ✨</p>
        </div>
      </div>
    </footer>
  );
}
