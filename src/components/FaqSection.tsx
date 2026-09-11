import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FaqItem } from '../types';

interface FaqSectionProps {
  faqItems: FaqItem[];
  title?: string;
  subtitle?: string;
}

export default function FaqSection({
  faqItems,
  title = "Questions Fréquentes • FAQ",
  subtitle = "Tout ce qu'il faut savoir sur vos prestations de prestige"
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-2">
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-[0.2em] text-[#B88F4D] font-semibold">Conseils d'Expert</span>
        <h3 className="font-serif text-2xl md:text-3xl font-medium text-charcoal mt-1">{title}</h3>
        <p className="text-secondary-gray text-xs md:text-sm mt-2 max-w-lg mx-auto">{subtitle}</p>
      </div>

      <div className="space-y-4">
        {faqItems.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={`faq-${index}`}
              className="group rounded-[24px] bg-white border border-[#B88F4D]/10 overflow-hidden transition-all duration-300 hover:border-[#B88F4D]/30"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex gap-3">
                  <HelpCircle className="h-5 w-5 text-[#B88F4D] shrink-0 mt-0.5" />
                  <span className="font-serif font-medium text-charcoal text-sm md:text-base group-hover:text-[#B88F4D] transition-colors duration-300">
                    {faq.question}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="shrink-0 mt-1"
                >
                  <ChevronDown className="h-5 w-5 text-secondary-gray group-hover:text-champagne transition-colors" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-1 text-sm md:text-base leading-relaxed text-secondary-gray border-t border-[#EFE7D2]">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
