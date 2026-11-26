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
    'h-6 w-6 text-[#101c30] transition-colors duration-150 group-hover:text-[#f47721]';
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
    <section id="services" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#f47721]">My Services</p>
            <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-[#101c30] sm:text-4xl">
              Reliable IT Operations &amp; Digital Capabilities
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[#64748b]">
              Practical enterprise infrastructure administration paired with responsive web
              development and digital growth services.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES_LIST.map((service, idx) => (
            <Reveal key={service.id} delayMs={idx * 40}>
              <article className="portfolio-card group flex h-full flex-col rounded-2xl p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#f3dfd0] bg-[#fff6ef] transition-colors duration-150 group-hover:border-[#101c30] group-hover:bg-[#101c30]">
                  <ServiceIcon iconKey={service.iconKey} />
                </div>

                <h3 className="mt-5 text-base font-bold leading-snug text-[#101c30]">
                  {service.title}
                </h3>

                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#64748b]">
                  {service.shortDescription}
                </p>

                <button
                  type="button"
                  onClick={() => onSelectService(service)}
                  className="mt-5 inline-flex min-h-[40px] items-center gap-1.5 self-start text-sm font-semibold text-[#101c30] transition-colors hover:text-[#f47721] cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowUpRight
                    className="h-4 w-4 text-[#f47721] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
