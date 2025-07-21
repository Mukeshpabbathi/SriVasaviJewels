import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const milestones = [
    { year: '1985', title: 'Foundation', description: 'Sri Vasavi Jewels was established with a vision to create timeless jewelry' },
    { year: '1995', title: 'Expansion', description: 'Opened our second showroom and expanded our craftsman team' },
    { year: '2005', title: 'Certification', description: 'Became certified by Bureau of Indian Standards (BIS)' },
    { year: '2015', title: 'Digital Era', description: 'Launched our online presence and e-commerce platform' },
    { year: '2020', title: 'Innovation', description: 'Introduced 3D jewelry design and virtual try-on technology' },
    { year: '2025', title: 'Excellence', description: 'Celebrating 40 years of crafting dreams and serving 10,000+ customers' }
  ];

  const team = [
    {
      name: 'Rajesh Vasavi',
      role: 'Founder & Master Craftsman',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      description: 'With 40+ years of experience, Rajesh founded SVJ with a passion for traditional craftsmanship.'
    },
    {
      name: 'Priya Vasavi',
      role: 'Design Director',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
      description: 'Leading our design team, Priya brings contemporary aesthetics to traditional jewelry.'
    },
    {
      name: 'Arjun Kumar',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      description: 'Ensuring quality and customer satisfaction across all our operations and services.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="text-2xl font-bold text-gold-600">Sri Vasavi Jewels</Link>
            <nav className="flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-gold-600">Home</Link>
              <Link to="/collections" className="text-gray-700 hover:text-gold-600">Collections</Link>
              <Link to="/about" className="text-gold-600 font-medium">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-gold-600">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gold-50 to-gold-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="text-gold-600">Story</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              For four decades, Sri Vasavi Jewels has been crafting dreams into reality, 
              creating timeless pieces that celebrate life's most precious moments.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Crafting Excellence Since 1985</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Sri Vasavi Jewels began as a small family business with a big dream - to create jewelry 
                  that would be treasured for generations. Founded by master craftsman Rajesh Vasavi, 
                  our journey started in a modest workshop with just three skilled artisans.
                </p>
                <p>
                  What set us apart from the beginning was our unwavering commitment to quality and 
                  our deep respect for traditional Indian jewelry-making techniques. Every piece that 
                  leaves our workshop is a testament to the skill, passion, and dedication of our craftsmen.
                </p>
                <p>
                  Today, we're proud to be one of the most trusted names in jewelry, serving over 10,000 
                  satisfied customers across the country. Our success is built on three pillars: 
                  exceptional craftsmanship, transparent pricing, and unmatched customer service.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=400&fit=crop"
                alt="Jewelry Workshop"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-gold-600 text-white p-6 rounded-lg shadow-lg">
                <p className="text-3xl font-bold">40+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">Key milestones in our four-decade journey</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gold-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="text-2xl font-bold text-gold-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-gold-600 rounded-full border-4 border-white shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">The passionate people behind Sri Vasavi Jewels</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 w-48 h-48 rounded-full mx-auto border-4 border-gold-200"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-gold-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gold-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600">Every piece meets the highest standards of craftsmanship and materials</p>
            </div>

            <div className="text-center">
              <div className="bg-gold-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Passion</h3>
              <p className="text-gray-600">We pour our heart and soul into every design and creation</p>
            </div>

            <div className="text-center">
              <div className="bg-gold-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust</h3>
              <p className="text-gray-600">Building lasting relationships through transparency and honesty</p>
            </div>

            <div className="text-center">
              <div className="bg-gold-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">Embracing new technologies while preserving traditional techniques</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gold-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Your Dream Jewelry?</h2>
          <p className="text-xl text-gold-100 mb-8">
            Let our master craftsmen bring your vision to life with our custom jewelry services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/collections"
              className="bg-white text-gold-600 hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium transition duration-300"
            >
              Browse Collections
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-gold-600 px-8 py-3 rounded-md text-lg font-medium transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
