import { siteConfig } from "@/lib/site";
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.phone}?text=${encodeURIComponent(
    siteConfig.whatsapp.message
  )}`;

  return (
    <footer className="border-t bg-background/60 backdrop-blur">
      <div className="container-page py-12 font-(family-name:--font-poppins)">
        <div className="grid gap-8 md:grid-cols-3">
          {/* MARCA */}
          <div>
            <p className="text-lg font-semibold">{siteConfig.name}</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Estudio de estética especializado en micropigmentación, cejas,
              pestañas y tratamientos faciales. Resultados naturales y prolijos.
            </p>
          </div>

          {/* CONTACTO */}
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

              <p className="text-xs">
                San Juan Capital, Argentina
              </p>
            </div>
          </div>

          {/* REDES */}
          <div>
            <p className="text-sm font-semibold">Seguinos</p>

            <div className="mt-4 flex items-center gap-4">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full border bg-background/40
                  transition hover:bg-(--brand-pink-soft)/20
                "
              >
                <FaInstagram className="text-base" />
              </a>

              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full border bg-background/40
                  transition hover:bg-(--brand-pink-soft)/20
                "
              >
                <FaFacebookF className="text-sm" />
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full border bg-background/40
                  transition hover:bg-(--brand-pink-soft)/20
                "
              >
                <FaWhatsapp className="text-base" />
              </a>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
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
