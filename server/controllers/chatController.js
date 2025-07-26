const Product = require('../models/Product');

// Enhanced jewelry knowledge base
const JEWELRY_KNOWLEDGE = {
  store_info: {
    name: 'Sri Vasavi Jewels',
    address: 'Main Branch: 123 Jewelry Street, Gold Market, Hyderabad, Telangana 500001',
    phone: '+91 9876543210',
    email: 'info@srivasavijewels.com',
    hours: {
      weekdays: '10:00 AM - 8:00 PM',
      weekends: '10:00 AM - 9:00 PM',
      sunday: '11:00 AM - 7:00 PM'
    },
    services: ['Custom Jewelry Design', 'Jewelry Repair', 'Gold Exchange', 'Certificate Verification', 'Free Cleaning'],
    specialties: ['Traditional Indian Jewelry', 'Modern Designs', 'Wedding Collections', 'Diamond Jewelry', 'Gold Ornaments']
  },
  metals: {
    gold: {
      purities: {
        '24K': 'Pure gold (99.9%), very soft, mainly used for investment. Too soft for daily wear jewelry.',
        '22K': 'Traditional Indian jewelry standard (91.6% gold), perfect balance of purity and durability. Ideal for wedding jewelry.',
        '18K': 'Premium jewelry grade (75% gold), durable and suitable for daily wear. Popular for engagement rings.',
        '14K': 'Affordable option (58.3% gold), very durable for everyday jewelry. Great for active lifestyles.'
      },
      care: 'Clean with mild soap and warm water. Use a soft brush for intricate designs. Store separately to avoid scratches. Avoid chemicals, perfumes, and chlorine.',
      investment: 'Gold retains value over time. Higher karat = higher gold content = higher value.'
    },
    silver: {
      purities: {
        '925': 'Sterling silver (92.5% silver), standard for quality jewelry. Durable and beautiful.',
        '999': 'Fine silver (99.9% silver), very soft, mainly for investment pieces.'
      },
      care: 'Clean with silver polish or baking soda paste. Store in anti-tarnish bags. Avoid exposure to air and moisture. Wear regularly to prevent tarnishing.',
      tarnishing: 'Silver naturally tarnishes when exposed to air. This is normal and can be cleaned.'
    },
    platinum: {
      purities: {
        '950': 'Premium platinum (95% platinum), hypoallergenic and extremely durable. Perfect for sensitive skin.'
      },
      care: 'Clean with mild detergent and soft brush. Very durable, minimal maintenance required. Develops natural patina over time.',
      benefits: 'Hypoallergenic, doesn\'t tarnish, extremely durable, prestigious metal.'
    },
    diamond: {
      grades: 'Diamonds are graded on 4Cs: Cut, Color, Clarity, Carat weight.',
      care: 'Clean with warm soapy water and soft brush. Diamonds are hard but can chip if hit at wrong angle.',
      certification: 'Always buy certified diamonds from reputable labs like GIA, IGI.'
    }
  },
  categories: {
    necklaces: {
      occasions: ['Wedding', 'Festival', 'Daily wear', 'Party', 'Office'],
      styles: ['Traditional', 'Modern', 'Antique', 'Contemporary', 'Temple jewelry'],
      lengths: {
        'Choker': '14-16 inches - Sits close to neck, great for V-necks',
        'Princess': '18 inches - Most popular length, suits most necklines',
        'Matinee': '20-24 inches - Perfect for business attire',
        'Opera': '28-34 inches - Elegant for evening wear, can be doubled'
      },
      layering: 'Mix different lengths and styles. Start with a choker, add princess length, finish with longer piece.'
    },
    rings: {
      occasions: ['Engagement', 'Wedding', 'Fashion', 'Cocktail', 'Anniversary'],
      styles: ['Solitaire', 'Halo', 'Three-stone', 'Vintage', 'Eternity', 'Cluster'],
      sizing: 'Ring sizes range from 4-12. Measure in evening when fingers are largest. Consider width - wider bands need larger size.',
      engagement: 'Solitaire is classic. Halo makes center stone look larger. Three-stone represents past, present, future.'
    },
    earrings: {
      types: ['Studs', 'Hoops', 'Drops', 'Chandeliers', 'Huggies', 'Climbers'],
      occasions: ['Daily wear', 'Office', 'Party', 'Wedding', 'Casual'],
      face_shapes: {
        'Round': 'Angular earrings, drops, long styles',
        'Oval': 'Most styles work well',
        'Square': 'Hoops, curved styles, avoid angular',
        'Heart': 'Studs, small hoops, avoid wide tops'
      }
    },
    bracelets: {
      types: ['Chain', 'Bangle', 'Cuff', 'Tennis', 'Charm'],
      sizing: 'Add 0.5-1 inch to wrist measurement for comfort',
      stacking: 'Mix metals and textures. Odd numbers look better.'
    }
  },
  occasions: {
    wedding: {
      bride: ['Heavy necklace sets', 'Matching earrings', 'Bangles/Kadas', 'Maang tikka', 'Nose ring', 'Toe rings'],
      groom: ['Chain', 'Bracelet', 'Ring', 'Cufflinks'],
      guests: ['Elegant sets', 'Statement pieces', 'Traditional designs']
    },
    festival: ['Traditional designs', 'Temple jewelry', 'Antique pieces', 'Gold preferred', 'Cultural motifs'],
    daily: ['Simple chains', 'Small earrings', 'Delicate rings', 'Comfortable pieces', 'Easy maintenance'],
    office: ['Subtle pieces', 'Professional look', 'Not too flashy', 'Classic designs'],
    party: ['Statement pieces', 'Bold designs', 'Eye-catching', 'Trendy styles'],
    gifting: {
      'Anniversary': 'Eternity rings, pendant sets, matching sets',
      'Birthday': 'Birthstone jewelry, personalized pieces',
      'Valentine': 'Heart motifs, romantic designs, red stones',
      'Mother\'s Day': 'Family-themed, birthstone combinations'
    }
  },
  trends: {
    '2024': ['Layered necklaces', 'Statement earrings', 'Vintage revival', 'Colored gemstones', 'Sustainable jewelry'],
    timeless: ['Diamond solitaires', 'Pearl earrings', 'Gold chains', 'Tennis bracelets', 'Hoop earrings']
  },
  budget_guide: {
    'Under ₹25,000': 'Silver jewelry, gold-plated pieces, small gold items',
    '₹25,000-₹50,000': 'Light gold jewelry, silver with stones, daily wear pieces',
    '₹50,000-₹1,00,000': 'Medium weight gold, diamond accents, occasion wear',
    '₹1,00,000-₹2,00,000': 'Heavy gold sets, diamond jewelry, wedding pieces',
    'Above ₹2,00,000': 'Premium collections, large diamonds, investment pieces'
  }
};

// Enhanced quick replies
const QUICK_REPLIES = {
  greeting: [
    'Show me gold necklaces',
    'What\'s trending now?',
    'Help with ring sizes',
    'Jewelry care tips'
  ],
  products: [
    'Show similar items',
    'What\'s the price range?',
    'Is this available?',
    'Care instructions'
  ],
  care: [
    'Gold care tips',
    'Silver maintenance',
    'Diamond cleaning',
    'Storage advice'
  ],
  sizing: [
    'Ring size guide',
    'Necklace lengths',
    'Bracelet sizing',
    'How to measure'
  ],
  occasions: [
    'Wedding jewelry',
    'Daily wear pieces',
    'Festival jewelry',
    'Gift ideas'
  ],
  budget: [
    'Under ₹25,000',
    '₹25,000-₹50,000',
    '₹50,000-₹1,00,000',
    'Premium collection'
  ]
};

// AI Chat Controller
class ChatController {
  
  // Process user message and generate AI response
  static async processMessage(req, res) {
    try {
      const { message, chatHistory = [] } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Message is required'
        });
      }

      console.log('Processing chat message:', message);

      // Analyze user intent
      const intent = await ChatController.analyzeIntent(message.toLowerCase());
      
      // Generate response based on intent
      const response = await ChatController.generateResponse(intent, message, chatHistory);
      
      res.json({
        success: true,
        data: response
      });

    } catch (error) {
      console.error('Chat processing error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing chat message'
      });
    }
  }

  // Enhanced intent analysis
  static async analyzeIntent(message) {
    const intent = {
      type: 'general',
      entities: {
        metal: null,
        category: null,
        occasion: null,
        priceRange: null,
        action: null,
        style: null,
        size: null
      },
      confidence: 0.5
    };

    // Metal detection
    if (message.includes('gold')) intent.entities.metal = 'gold';
    if (message.includes('silver')) intent.entities.metal = 'silver';
    if (message.includes('platinum')) intent.entities.metal = 'platinum';
    if (message.includes('diamond')) intent.entities.metal = 'diamond';

    // Category detection
    if (message.includes('necklace') || message.includes('chain')) intent.entities.category = 'necklaces';
    if (message.includes('ring')) intent.entities.category = 'rings';
    if (message.includes('earring')) intent.entities.category = 'earrings';
    if (message.includes('bracelet')) intent.entities.category = 'bracelets';
    if (message.includes('bangle')) intent.entities.category = 'bangles';

    // Occasion detection
    if (message.includes('wedding') || message.includes('bridal')) intent.entities.occasion = 'wedding';
    if (message.includes('festival') || message.includes('traditional')) intent.entities.occasion = 'festival';
    if (message.includes('daily') || message.includes('everyday')) intent.entities.occasion = 'daily';
    if (message.includes('office') || message.includes('work')) intent.entities.occasion = 'office';
    if (message.includes('party') || message.includes('evening')) intent.entities.occasion = 'party';
    if (message.includes('gift') || message.includes('present')) intent.entities.occasion = 'gifting';

    // Price range detection with better parsing
    const pricePatterns = [
      /under (\d+(?:,\d+)*)/i,
      /below (\d+(?:,\d+)*)/i,
      /less than (\d+(?:,\d+)*)/i,
      /(\d+(?:,\d+)*)\s*to\s*(\d+(?:,\d+)*)/i,
      /between (\d+(?:,\d+)*) and (\d+(?:,\d+)*)/i
    ];

    for (const pattern of pricePatterns) {
      const match = message.match(pattern);
      if (match) {
        if (match[2]) {
          // Range detected
          intent.entities.priceRange = {
            min: parseInt(match[1].replace(/,/g, '')),
            max: parseInt(match[2].replace(/,/g, ''))
          };
        } else {
          // Upper limit detected
          intent.entities.priceRange = { max: parseInt(match[1].replace(/,/g, '')) };
        }
        break;
      }
    }

    // Action detection - order matters!
    if (message.includes('find rings size') || message.includes('show rings size') || message.includes('rings size')) intent.type = 'product_search';
    else if (message.includes('show') || message.includes('find') || message.includes('search')) intent.type = 'product_search';
    else if (message.includes('care') || message.includes('clean') || message.includes('maintain')) intent.type = 'care_advice';
    else if (message.includes('size') || message.includes('fit') || message.includes('measure')) intent.type = 'sizing_help';
    else if (message.includes('price') || message.includes('cost') || message.includes('expensive') || message.includes('budget')) intent.type = 'pricing_info';
    else if (message.includes('trending') || message.includes('popular') || message.includes('latest') || message.includes('fashion')) intent.type = 'trending';
    else if (message.includes('compare') || message.includes('difference') || message.includes('vs')) intent.type = 'comparison';
    else if (message.includes('invest') || message.includes('value') || message.includes('worth')) intent.type = 'investment_advice';
    else if (message.includes('location') || message.includes('address') || message.includes('store') || message.includes('shop') || message.includes('visit') || message.includes('where')) intent.type = 'store_info';

    return intent;
  }

  // Enhanced response generation
  static async generateResponse(intent, originalMessage, chatHistory) {
    let response = {
      response: '',
      quickReplies: [],
      products: [],
      suggestions: []
    };

    switch (intent.type) {
      case 'product_search':
        response = await ChatController.handleProductSearch(intent, originalMessage);
        break;
      
      case 'care_advice':
        response = ChatController.handleCareAdvice(intent);
        break;
      
      case 'sizing_help':
        response = ChatController.handleSizingHelp(intent);
        break;
      
      case 'pricing_info':
        response = await ChatController.handlePricingInfo(intent);
        break;
      
      case 'trending':
        response = await ChatController.handleTrending();
        break;
      
      case 'comparison':
        response = ChatController.handleComparison(intent, originalMessage);
        break;
      
      case 'investment_advice':
        response = ChatController.handleInvestmentAdvice(intent);
        break;
      
      case 'store_info':
        response = ChatController.handleStoreInfo(intent, originalMessage);
        break;
      
      default:
        response = ChatController.handleGeneral(originalMessage, intent);
        break;
    }

    return response;
  }

  // Enhanced product search with better filtering
  static async handleProductSearch(intent, message) {
    try {
      let query = { isActive: true };
      let responseText = 'I found ';

      // Handle specific ring size searches
      if (message.includes('rings size') || message.includes('ring size')) {
        const sizeMatch = message.match(/size (\d+)/i);
        if (sizeMatch) {
          const size = sizeMatch[1];
          query.category = new RegExp('rings', 'i');
          
          // Search for rings (we'll add size filtering later when size field is added to products)
          const rings = await Product.find(query)
            .select('name price discountPrice category metal images finalPrice stock')
            .limit(6)
            .sort({ isFeatured: -1, createdAt: -1 });

          if (rings.length > 0) {
            return {
              response: `Here are beautiful rings that would work for size ${size}! Our experts can help with exact sizing:`,
              products: rings.map(product => ({
                id: product._id,
                name: product.name,
                price: product.finalPrice,
                originalPrice: product.price,
                category: product.category,
                metal: product.metal,
                image: product.images?.[0]?.url,
                url: `/product/${product._id}`,
                inStock: product.stock?.quantity > 0
              })),
              quickReplies: [
                'Visit for sizing',
                'Ring size guide',
                'Other ring sizes',
                'Store location'
              ]
            };
          } else {
            return {
              response: `I don't have rings in our current collection, but our experts can help you find the perfect ring in size ${size}. Visit our store for personalized assistance!`,
              quickReplies: [
                'Store location',
                'Custom rings',
                'Call store',
                'Show all jewelry'
              ]
            };
          }
        }
      }

      // Build search query for other searches
      if (intent.entities.metal) {
        query.metal = new RegExp(intent.entities.metal, 'i');
        responseText += `${intent.entities.metal} `;
      }

      if (intent.entities.category) {
        query.category = new RegExp(intent.entities.category, 'i');
        responseText += `${intent.entities.category} `;
      }

      if (intent.entities.priceRange) {
        query.price = {};
        if (intent.entities.priceRange.min) query.price.$gte = intent.entities.priceRange.min;
        if (intent.entities.priceRange.max) query.price.$lte = intent.entities.priceRange.max;
        
        if (intent.entities.priceRange.max && !intent.entities.priceRange.min) {
          responseText += `under ₹${intent.entities.priceRange.max.toLocaleString()} `;
        } else if (intent.entities.priceRange.min && intent.entities.priceRange.max) {
          responseText += `between ₹${intent.entities.priceRange.min.toLocaleString()} - ₹${intent.entities.priceRange.max.toLocaleString()} `;
        }
      }

      // Search products
      const products = await Product.find(query)
        .select('name price discountPrice category metal images finalPrice stock')
        .limit(6)
        .sort({ isFeatured: -1, createdAt: -1 });

      if (products.length > 0) {
        responseText += `${products.length} beautiful ${responseText}pieces for you! Here are some options:`;
        
        return {
          response: responseText,
          products: products.map(product => ({
            id: product._id,
            name: product.name,
            price: product.finalPrice,
            originalPrice: product.price,
            category: product.category,
            metal: product.metal,
            image: product.images?.[0]?.url,
            url: `/product/${product._id}`,
            inStock: product.stock?.quantity > 0
          })),
          quickReplies: [
            'Show more options',
            'Filter by price',
            'Care instructions',
            'Size guide'
          ]
        };
      } else {
        return {
          response: `I couldn't find any ${responseText}items matching your criteria. Let me suggest some alternatives or help you explore other options!`,
          quickReplies: [
            'Show all products',
            'Different price range',
            'Other categories',
            'Visit store'
          ]
        };
      }
    } catch (error) {
      console.error('Product search error:', error);
      return {
        response: 'I\'m having trouble searching for products right now. Please try again or visit our store for personalized assistance!',
        quickReplies: ['Store location', 'Call store', 'Try again', 'Browse collections']
      };
    }
  }

  // Enhanced care advice
  static handleCareAdvice(intent) {
    const metal = intent.entities.metal;
    
    if (metal && JEWELRY_KNOWLEDGE.metals[metal]) {
      const metalInfo = JEWELRY_KNOWLEDGE.metals[metal];
      let response = `Here's how to care for your ${metal} jewelry:\n\n${metalInfo.care}`;
      
      if (metalInfo.tarnishing) {
        response += `\n\n💡 Tip: ${metalInfo.tarnishing}`;
      }
      
      return {
        response,
        quickReplies: QUICK_REPLIES.care
      };
    }

    return {
      response: `Here are essential jewelry care tips:\n\n• Store each piece separately to prevent scratches\n• Clean regularly with appropriate methods\n• Remove before swimming, exercising, or cleaning\n• Avoid contact with perfumes, lotions, and chemicals\n• Have professional cleaning done annually\n\nWhich specific metal would you like detailed care instructions for?`,
      quickReplies: ['Gold care', 'Silver care', 'Diamond care', 'Platinum care']
    };
  }

  // Enhanced sizing help
  static handleSizingHelp(intent) {
    const category = intent.entities.category;
    
    if (category === 'rings') {
      return {
        response: `Ring Sizing Guide 💍\n\n• Most common sizes: 6-8 (women), 9-11 (men)\n• Measure in the evening when fingers are largest\n• Wide bands need 0.5 size larger\n• Consider knuckle size - ring should slide over comfortably\n• Professional sizing is most accurate\n\n📏 DIY Method: Wrap string around finger, mark overlap, measure length in mm, divide by 3.14`,
        quickReplies: ['Find rings size 6', 'Find rings size 7', 'Ring size chart', 'Store locations']
      };
    }

    if (category === 'necklaces') {
      const lengths = JEWELRY_KNOWLEDGE.categories.necklaces.lengths;
      let response = 'Necklace Length Guide ✨\n\n';
      
      Object.entries(lengths).forEach(([name, description]) => {
        response += `• ${name}: ${description}\n`;
      });
      
      response += '\n💡 Tip: ' + JEWELRY_KNOWLEDGE.categories.necklaces.layering;
      
      return {
        response,
        quickReplies: ['Short necklaces', 'Long necklaces', 'Layering tips', 'Show necklaces']
      };
    }

    return {
      response: `I can help you with sizing for all jewelry types:\n\n💍 Rings: Size 4-12, professional measurement recommended\n📿 Necklaces: 14"-34" lengths for different styles\n🔗 Bracelets: Wrist + 0.5-1" for comfort\n👂 Earrings: Consider face shape and comfort\n\nWhat would you like to know more about?`,
      quickReplies: QUICK_REPLIES.sizing
    };
  }

  // New comparison handler
  static handleComparison(intent, message) {
    if (message.includes('gold') && (message.includes('silver') || message.includes('platinum'))) {
      return {
        response: `Gold vs Silver vs Platinum Comparison:\n\n🥇 Gold:\n• Doesn't tarnish\n• Retains value\n• Available in different purities\n• Warm color tone\n\n🥈 Silver:\n• More affordable\n• Bright white color\n• Can tarnish (easily cleaned)\n• Great for trendy pieces\n\n⚪ Platinum:\n• Most durable\n• Hypoallergenic\n• Doesn't tarnish\n• Premium pricing\n\nWhich metal interests you most?`,
        quickReplies: ['Show gold jewelry', 'Show silver jewelry', 'Show platinum jewelry', 'Price comparison']
      };
    }

    return {
      response: 'I can help you compare different jewelry options! What would you like to compare? For example:\n\n• Gold vs Silver\n• Different ring styles\n• Necklace lengths\n• Price ranges',
      quickReplies: ['Metal comparison', 'Style comparison', 'Price comparison', 'Quality comparison']
    };
  }

  // New investment advice handler
  static handleInvestmentAdvice(intent) {
    return {
      response: `Jewelry Investment Guide 💰\n\n🥇 Best for Investment:\n• 22K-24K gold jewelry\n• Certified diamonds\n• Platinum pieces\n• Classic designs (retain value)\n\n📈 Value Factors:\n• Metal purity and weight\n• Craftsmanship quality\n• Brand reputation\n• Market demand\n\n💡 Tips:\n• Buy from certified jewelers\n• Keep all certificates\n• Consider making charges\n• Classic designs over trendy\n\nWould you like to see our investment-grade pieces?`,
      quickReplies: ['22K gold jewelry', 'Certified diamonds', 'Classic designs', 'Investment tips']
    };
  }

  // Enhanced pricing info
  static async handlePricingInfo(intent) {
    try {
      const priceStats = await Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$category',
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
            avgPrice: { $avg: '$price' },
            count: { $sum: 1 }
          }
        },
        { $sort: { avgPrice: 1 } }
      ]);

      if (priceStats.length > 0) {
        let responseText = 'Here\'s our price guide by category:\n\n';
        
        priceStats.forEach(stat => {
          responseText += `💎 ${stat._id}: ₹${stat.minPrice.toLocaleString()} - ₹${stat.maxPrice.toLocaleString()}\n`;
        });

        responseText += '\n💰 Budget Guide:\n';
        Object.entries(JEWELRY_KNOWLEDGE.budget_guide).forEach(([range, description]) => {
          responseText += `• ${range}: ${description}\n`;
        });

        responseText += '\nWhat\'s your preferred budget range?';

        return {
          response: responseText,
          quickReplies: QUICK_REPLIES.budget
        };
      }
    } catch (error) {
      console.error('Pricing info error:', error);
    }

    return {
      response: 'Our jewelry collection spans various price ranges to suit every budget:\n\n💎 Factors affecting price:\n• Metal type and purity\n• Weight and craftsmanship\n• Gemstone quality\n• Design complexity\n\nWhat\'s your budget range? I can show you the best options!',
      quickReplies: QUICK_REPLIES.budget
    };
  }

  // Enhanced trending handler
  static async handleTrending() {
    try {
      const trendingProducts = await Product.find({ 
        isActive: true, 
        isFeatured: true 
      })
        .select('name price category metal images finalPrice')
        .limit(4)
        .sort({ createdAt: -1 });

      let response = '✨ What\'s Trending in 2024:\n\n';
      JEWELRY_KNOWLEDGE.trends['2024'].forEach(trend => {
        response += `• ${trend}\n`;
      });
      
      response += '\n💎 Timeless Classics:\n';
      JEWELRY_KNOWLEDGE.trends.timeless.forEach(classic => {
        response += `• ${classic}\n`;
      });

      if (trendingProducts.length > 0) {
        response += '\n🔥 Our trending pieces:';
        
        return {
          response,
          products: trendingProducts.map(product => ({
            id: product._id,
            name: product.name,
            price: product.finalPrice,
            category: product.category,
            metal: product.metal,
            image: product.images?.[0]?.url,
            url: `/product/${product._id}`
          })),
          quickReplies: [
            'Show layered necklaces',
            'Statement earrings',
            'Vintage styles',
            'Colored gemstones'
          ]
        };
      }
    } catch (error) {
      console.error('Trending products error:', error);
    }

    return {
      response: '✨ Currently trending: Layered necklaces, statement earrings, vintage revival pieces, and colored gemstones! These styles are very popular right now. What type interests you?',
      quickReplies: QUICK_REPLIES.greeting
    };
  }

  // New store info handler
  static handleStoreInfo(intent, message) {
    const storeInfo = JEWELRY_KNOWLEDGE.store_info;
    
    if (message.includes('location') || message.includes('address') || message.includes('where')) {
      return {
        response: `📍 Sri Vasavi Jewels Location:\n\n${storeInfo.address}\n\n📞 Contact:\nPhone: ${storeInfo.phone}\nEmail: ${storeInfo.email}\n\n🕒 Store Hours:\nMon-Fri: ${storeInfo.hours.weekdays}\nSat: ${storeInfo.hours.weekends}\nSun: ${storeInfo.hours.sunday}\n\nWe'd love to see you in person! Our experts can help you find the perfect piece.`,
        quickReplies: ['Get directions', 'Call store', 'Store services', 'Visit for sizing']
      };
    }
    
    if (message.includes('hours') || message.includes('time') || message.includes('open')) {
      return {
        response: `🕒 Sri Vasavi Jewels Store Hours:\n\nMonday - Friday: ${storeInfo.hours.weekdays}\nSaturday: ${storeInfo.hours.weekends}\nSunday: ${storeInfo.hours.sunday}\n\n📍 Location: ${storeInfo.address}\n📞 Phone: ${storeInfo.phone}\n\nWe're here to help you find beautiful jewelry!`,
        quickReplies: ['Store location', 'Call store', 'Store services', 'Book appointment']
      };
    }
    
    if (message.includes('service') || message.includes('repair') || message.includes('custom')) {
      return {
        response: `🔧 Our Services at Sri Vasavi Jewels:\n\n${storeInfo.services.map(service => `• ${service}`).join('\n')}\n\n✨ We Specialize In:\n${storeInfo.specialties.map(specialty => `• ${specialty}`).join('\n')}\n\nVisit us for personalized service and expert advice!`,
        quickReplies: ['Store location', 'Store hours', 'Custom design', 'Jewelry repair']
      };
    }
    
    return {
      response: `🏪 Welcome to Sri Vasavi Jewels!\n\n📍 ${storeInfo.address}\n📞 ${storeInfo.phone}\n📧 ${storeInfo.email}\n\n🕒 Hours: ${storeInfo.hours.weekdays} (Mon-Fri)\n\nWe offer expert jewelry services and have a beautiful collection waiting for you. What would you like to know?`,
      quickReplies: ['Store location', 'Store hours', 'Store services', 'Visit store']
    };
  }
  static handleGeneral(message, intent) {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    const thanks = ['thank', 'thanks', 'appreciate'];
    const help = ['help', 'assist', 'support'];
    
    if (greetings.some(greeting => message.toLowerCase().includes(greeting))) {
      return {
        response: 'Hello! Welcome to Sri Vasavi Jewels! ✨\n\nI\'m your personal jewelry assistant. I can help you with:\n\n💎 Finding the perfect jewelry\n🔍 Product recommendations\n💰 Pricing and budget guidance\n🧼 Care instructions\n📏 Sizing help\n✨ Latest trends\n\nWhat are you looking for today?',
        quickReplies: QUICK_REPLIES.greeting
      };
    }

    if (thanks.some(thank => message.toLowerCase().includes(thank))) {
      return {
        response: 'You\'re very welcome! 😊 I\'m here to help make your jewelry shopping experience amazing. Is there anything else you\'d like to know about our beautiful collection?',
        quickReplies: QUICK_REPLIES.greeting
      };
    }

    if (help.some(h => message.toLowerCase().includes(h))) {
      return {
        response: 'I\'m here to help! 🤝 I\'m your jewelry expert and can assist with:\n\n🔍 Product search and recommendations\n💰 Budget and pricing guidance\n📏 Sizing and fit advice\n🧼 Jewelry care tips\n✨ Style and trend advice\n💎 Metal and gemstone information\n🎁 Gift suggestions\n\nWhat would you like help with?',
        quickReplies: QUICK_REPLIES.greeting
      };
    }

    // Default response
    return {
      response: 'I\'m your jewelry assistant at Sri Vasavi Jewels! 💎\n\nI can help you with:\n• Finding perfect jewelry pieces\n• Answering questions about metals and gems\n• Providing care instructions\n• Sizing guidance\n• Style recommendations\n• Budget advice\n\nWhat would you like to explore today?',
      quickReplies: QUICK_REPLIES.greeting
    };
  }
}

module.exports = ChatController;
