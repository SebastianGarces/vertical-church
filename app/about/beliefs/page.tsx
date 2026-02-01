import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { PartnersBanner } from '../../components/PartnersBanner';
import BeliefsContent from './content.mdx';

export const metadata = {
  title: 'What We Believe | Vertical Church',
  description:
    "Explore Vertical Church's doctrinal statements and beliefs about scripture, salvation, church governance, and more.",
};

export default function BeliefsPage() {
  return (
    <div className='min-h-screen overflow-x-hidden bg-navy'>
      <Header />
      {/* Cream background wrapper that sits below header */}
      <div className='mt-16 bg-navy pt-8 md:mt-20 md:pt-12'>
        <main>
          {/* Hero Banner */}
          <section className='rounded-t-[32px] bg-florence py-6'>
            <div className='mx-auto max-w-7xl px-4 md:px-8'>
              <h1 className='text-center font-tagline text-[48px] leading-[48px] text-pipper'>What We Believe</h1>
            </div>
          </section>

          {/* Content */}
          <section className='bg-cream pb-16 md:pb-24'>
            <BeliefsContent />
          </section>
        </main>
        <PartnersBanner />
        <Footer />
      </div>
    </div>
  );
}
