import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, MapPin, Search, ExternalLink, Building2, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/croc")({
  head: () => ({
    meta: [
      { title: "CROC University Finder — Sbaihi AI" },
      {
        name: "description",
        content:
          "Explore Moroccan universities and schools. Filter by city, field, and type to find your best fit.",
      },
      { property: "og:title", content: "CROC University Finder — Sbaihi AI" },
      {
        property: "og:description",
        content:
          "Explore Moroccan universities and schools. Filter by city, field, and type to find your best fit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CrocPage,
});

const fieldLabels: Record<string, string> = {
  general: "General",
  engineering: "Engineering",
  medicine: "Medicine & Pharmacy",
  business: "Business",
  technology: "Technology",
};

function CrocPage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState<string>("all");
  const [field, setField] = useState<string>("all");
  const [type, setType] = useState<string>("all");

  const { data: universities, isLoading } = useQuery({
    queryKey: ["universities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("universities").select("*").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const cities = useMemo(() => {
    const set = new Set(universities?.map((u) => u.city) ?? []);
    return ["all", ...Array.from(set).sort()];
  }, [universities]);

  const fields = useMemo(
    () => ["all", "general", "engineering", "medicine", "business", "technology"],
    [],
  );
  const types = useMemo(() => ["all", "public", "private"], []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (universities ?? []).filter((u) => {
      const matchesSearch =
        !term ||
        u.name.toLowerCase().includes(term) ||
        u.city.toLowerCase().includes(term) ||
        u.description?.toLowerCase().includes(term);
      const matchesCity = city === "all" || u.city === city;
      const matchesField = field === "all" || u.field === field;
      const matchesType = type === "all" || u.type === type;
      return matchesSearch && matchesCity && matchesField && matchesType;
    });
  }, [universities, search, city, field, type]);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="CROC University Finder"
        title="Find your university"
        description="Browse Moroccan universities and grandes écoles. Filter by city, field, or type to discover your next step."
      />

      <div className="neo-panel rounded-[2rem] p-4 sm:p-7 lg:rounded-[2.5rem] lg:p-9">
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city, or keyword"
              className="neo-inset neo-focus h-14 w-full rounded-2xl border-0 pl-12 pr-4 text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:gap-3">
            <FilterSelect
              icon={<MapPin className="h-4 w-4" />}
              value={city}
              onChange={setCity}
              options={cities}
              label="City"
            />
            <FilterSelect
              icon={<GraduationCap className="h-4 w-4" />}
              value={field}
              onChange={setField}
              options={fields}
              label="Field"
              format={fieldLabels}
            />
            <FilterSelect
              icon={<Building2 className="h-4 w-4" />}
              value={type}
              onChange={setType}
              options={types}
              label="Type"
              format={{ public: "Public", private: "Private" }}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {isLoading
              ? "Loading universities…"
              : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
          </span>
          <span className="hidden sm:inline">{universities?.length ?? 0} schools indexed</span>
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((u) => (
              <div
                key={u.id}
                className="neo-raised neo-interactive group flex flex-col justify-between rounded-3xl p-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{u.name}</h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.type === "public"
                          ? "bg-teal/15 text-teal"
                          : "bg-primary/25 text-foreground"
                      }`}
                    >
                      {u.type === "public" ? "Public" : "Private"}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {u.city}
                  </p>
                  <p className="mt-3 line-clamp-3 text-sm text-foreground/80">{u.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                    {fieldLabels[u.field] ?? u.field}
                  </span>
                  {u.website && (
                    <a
                      href={u.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      Website <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">
            <Filter className="mx-auto h-10 w-10 opacity-50" />
            <p className="mt-3 font-medium text-foreground">No universities match your filters</p>
            <p className="text-sm">Try clearing a filter or searching with different keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  icon,
  value,
  onChange,
  options,
  label,
  format,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
  format?: Record<string, string>;
}) {
  return (
    <div className="relative min-w-0 last:col-span-2 sm:last:col-span-1">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {icon}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="neo-inset neo-focus h-14 w-full appearance-none rounded-2xl border-0 py-3 pl-10 pr-8 text-sm text-foreground outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === "all" ? `All ${label}s` : (format?.[opt] ?? opt)}
          </option>
        ))}
      </select>
    </div>
  );
}
