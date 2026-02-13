import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { faqData } from '../data/faqData';

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [filteredFAQs, setFilteredFAQs] = useState(faqData);

  useEffect(() => {
    // Filter FAQs based on search query
    if (searchQuery.trim() === '') {
      setFilteredFAQs(faqData);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = faqData.map(category => ({
      ...category,
      questions: category.questions.filter(
        q => 
          q.question.toLowerCase().includes(query) || 
          q.answer.toLowerCase().includes(query)
      )
    })).filter(category => category.questions.length > 0);

    setFilteredFAQs(filtered);
  }, [searchQuery]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="section-title mb-8">
          <span className="gradient-text">Frequently Asked Questions</span>
        </h1>

        {/* Search Bar */}
        <div className="relative mb-12">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-12 py-4 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredFAQs.map(category => (
            <div 
              key={category.id}
              className="bg-gray-dark rounded-lg overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-black/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-neon">{category.icon}</span>
                  <h2 className="text-xl font-bold">{category.title}</h2>
                </div>
                {expandedCategories.includes(category.id) ? (
                  <ChevronUp className="w-5 h-5 text-neon" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neon" />
                )}
              </button>

              {/* Questions & Answers */}
              {expandedCategories.includes(category.id) && (
                <div className="border-t border-gray-700">
                  {category.questions.map((qa, index) => (
                    <div 
                      key={index}
                      className="p-6 border-b border-gray-700 last:border-b-0"
                    >
                      <h3 className="text-lg font-semibold mb-3">{qa.question}</h3>
                      <p className="text-gray-300">{qa.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;