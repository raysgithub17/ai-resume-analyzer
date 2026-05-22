import { siteConfig } from "@/lib/site";

type JsonLdProps = {
  readonly data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebApplicationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "PDF resume upload",
          "Job description matching",
          "ATS compatibility score",
          "Skills gap analysis",
          "Actionable improvement suggestions",
        ],
      }}
    />
  );
}
