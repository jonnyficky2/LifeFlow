import { quotes as localQuotes } from './quotes';

export interface Quote {
  text: string;
  author: string;
}

export interface QuoteProvider {
  getQuote(): Promise<Quote | null>;
}

export class LocalQuoteProvider implements QuoteProvider {
  async getQuote(): Promise<Quote | null> {
    const randomIndex = Math.floor(Math.random() * localQuotes.length);
    return localQuotes[randomIndex];
  }

  getQuoteSync(): Quote {
    const randomIndex = Math.floor(Math.random() * localQuotes.length);
    return localQuotes[randomIndex];
  }
}

export class ApiQuoteProvider implements QuoteProvider {
  async getQuote(): Promise<Quote | null> {
    try {
      const response = await fetch("https://dummyjson.com/quotes/random");
      if (!response.ok) return null;
      const data = await response.json();
      if (data && data.quote && data.author) {
        return { text: data.quote, author: data.author };
      }
      return null;
    } catch {
      return null;
    }
  }
}

export class CachedQuoteProvider implements QuoteProvider {
  private CACHE_KEY = 'cached_api_quote';

  async getQuote(): Promise<Quote | null> {
    return this.getQuoteSync();
  }

  getQuoteSync(): Quote | null {
    const cached = localStorage.getItem(this.CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        localStorage.removeItem(this.CACHE_KEY);
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  }

  saveQuote(quote: Quote) {
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(quote));
  }
}

export class QuoteManager {
  private localProvider = new LocalQuoteProvider();
  private cachedProvider = new CachedQuoteProvider();
  private apiProvider = new ApiQuoteProvider();

  public getDailyQuote(): Quote {
    const today = new Date().toISOString().split("T")[0];
    const dailyDataStr = localStorage.getItem('daily_quote_data');
    
    // 1. Check if we already have a quote for today
    if (dailyDataStr) {
      try {
        const parsed = JSON.parse(dailyDataStr);
        if (parsed.date === today && parsed.quote) {
          this.prefetchBackground();
          return parsed.quote;
        }
      } catch (e) {
        console.warn("Failed to parse daily quote", e);
      }
    }

    // 2. We need a new quote for today.
    // We try cache first (populated by previous API requests), then fallback to local
    let newQuote = this.cachedProvider.getQuoteSync();
    
    if (!newQuote) {
       newQuote = this.localProvider.getQuoteSync();
    }

    // 3. Save as today's quote
    localStorage.setItem('daily_quote_data', JSON.stringify({
      date: today,
      quote: newQuote
    }));

    // 4. Trigger background fetch for future use
    this.prefetchBackground();

    return newQuote;
  }

  private async prefetchBackground() {
    const apiQuote = await this.apiProvider.getQuote();
    if (apiQuote) {
      this.cachedProvider.saveQuote(apiQuote);
    }
  }
}

export const quoteManager = new QuoteManager();
