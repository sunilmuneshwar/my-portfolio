import {
  ArrowUpRight,
  Cloud,
  Code2,
  Layers,
  LayoutGrid,
  MonitorCog,
  Network,
  Server,
  TrendingUp,
} from 'lucide-react';
import { SERVICES_LIST } from '../data/defaultPortfolio';
import type { ServiceItem } from '../types/portfolio';
import { Reveal } from './Reveal';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

function ServiceIcon({ iconKey }: { iconKey: ServiceItem['iconKey'] }) {
  const iconClass =
    'h-6 w-6 text-[#1A488E] transition-colors duration-150 group-hover:text-[#97B2DE]';
  switch (iconKey) {
    case 'infrastructure':
      return <Server className={iconClass} aria-hidden="true" />;
    case 'vmware':
      return <Layers className={iconClass} aria-hidden="true" />;
    case 'windows':
      return <MonitorCog className={iconClass} aria-hidden="true" />;
    case 'azure':
      return <Cloud className={iconClass} aria-hidden="true" />;
    case 'network':
      return <Network className={iconClass} aria-hidden="true" />;
    case 'm365':
      return <LayoutGrid className={iconClass} aria-hidden="true" />;
    case 'web':
      return <Code2 className={iconClass} aria-hidden="true" />;
    case 'marketing':
      return <TrendingUp className={iconClass} aria-hidden="true" />;
  }
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  return (
    <section id="services" className="border-y border-[#97B2DE]/15 bg-[#152c4d] py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#97B2DE]">My Services</p>
            <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Reliable IT Operations &amp; Digital Capabilities
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[#d8e5f7]">
              Practical enterprise infrastructure administration paired with responsive web
              development and digital growth services.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES_LIST.map((service, idx) => (
            <Reveal key={service.id} delayMs={idx * 40}>
              <article className="portfolio-card group flex h-full flex-col rounded-2xl p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d3e0f2] bg-[#eef4fc] transition-colors duration-150 group-hover:border-[#092147] group-hover:bg-[#092147]">
                  <ServiceIcon iconKey={service.iconKey} />
                </div>

                <h3 className="mt-5 text-base font-bold leading-snug text-[#092147]">
                  {service.title}
                </h3>

                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#3b557a]">
                  {service.shortDescription}
                </p>

                <button
                  type="button"
                  onClick={() => onSelectService(service)}
                  className="mt-5 inline-flex min-h-[40px] items-center gap-1.5 self-start text-sm font-semibold text-[#092147] transition-colors hover:text-[#1A488E] cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowUpRight
                    className="h-4 w-4 text-[#1A488E] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
