import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { useAllCategories } from '@/hooks/api/use-categories';
import type { Category } from '@/types';

interface CollectionCardProps {
  category: Category;
  imageUrl?: string;
  featured?: boolean;
}

function CollectionCard({ category, imageUrl, featured = false }: CollectionCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;
  return (
    <Link
      to={`/shop?categoryId=${category.id}`}
      className={`group relative block overflow-hidden bg-[#121115] ${featured ? 'aspect-[4/3] sm:aspect-video' : 'aspect-[3/4]'}`}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt=""
          loading={featured ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(212,195,163,0.12),transparent_34%),linear-gradient(145deg,#19161a,#0d0c0f)]" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,10,12,0.86)_0%,rgba(11,10,12,0.22)_62%,transparent_100%)]" />
      <div className="absolute inset-0 border border-transparent transition-colors duration-300 group-hover:border-[#D4A017]/30" />
      <div
        className={`absolute inset-0 flex flex-col justify-end ${featured ? 'p-7 sm:p-8 lg:p-12' : 'p-6'}`}
      >
        {featured && (
          <p className="mb-2 text-[9px] font-medium tracking-[0.2em] text-[#D4C3A3]/60 uppercase transition-colors group-hover:text-[#D4A017]">
            Featured Collection
          </p>
        )}
        <h2
          className={`font-serif leading-[1.15] font-normal text-white/[0.88] transition-colors group-hover:text-white ${featured ? 'text-[clamp(1.75rem,3vw,2.75rem)]' : 'text-[clamp(1.1rem,1.8vw,1.4rem)]'}`}
        >
          {category.name}
        </h2>
        <p
          className={`mt-2 max-w-2xl font-light text-white/45 ${featured ? 'mb-5 text-[13px]' : 'mb-3.5 line-clamp-2 text-[11px]'}`}
        >
          {category.description || `Explore our ${category.name.toLowerCase()} selection.`}
        </p>
        <span
          className={`inline-flex items-center gap-2 text-[9px] font-medium tracking-[0.15em] text-[#D4A017] uppercase transition-all group-hover:gap-3 ${featured ? '' : 'opacity-0 group-hover:opacity-100'}`}
        >
          Explore <ArrowRight size={featured ? 12 : 10} />
        </span>
      </div>
    </Link>
  );
}

export function CollectionsPage() {
  const categories = useAllCategories();

  if (categories.isLoading)
    return (
      <div className="min-h-screen bg-[#0B0A0C]">
        <PageLoader />
      </div>
    );
  if (categories.isError)
    return (
      <div className="min-h-screen bg-[#0B0A0C] px-6 py-24">
        <EmptyState title="Failed to load collections" message="Please try again later" />
      </div>
    );

  const items = categories.data?.items ?? [];
  const [featured, ...rest] = items;

  return (
    <main className="min-h-screen bg-[#0B0A0C] text-[#F3F2F5]">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <Breadcrumb
          items={[{ label: 'Home', href: '/' }, { label: 'Collections' }]}
          className="mb-8"
        />
        <div className="mb-10">
          <p className="mb-2 text-[9px] font-medium tracking-[0.22em] text-[#D4C3A3]/40 uppercase">
            The Collections
          </p>
          <h1 className="mb-2 font-serif text-[clamp(1.6rem,3vw,2.5rem)] font-normal text-white/[0.88]">
            Curated Worlds of Scent
          </h1>
          <p className="max-w-[520px] text-xs font-light text-white/30 italic">
            Each collection is a distinct olfactory world, composed with a single intent.
          </p>
        </div>

        {!featured ? (
          <EmptyState
            title="No collections available"
            message="Check back later for new collections"
          />
        ) : (
          <>
            <div className="mb-5">
              <CollectionCard category={featured} imageUrl={featured.imageUrl} featured />
            </div>
            {!!rest.length && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {rest.map((category) => (
                  <CollectionCard
                    key={category.id}
                    category={category}
                    imageUrl={category.imageUrl}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
