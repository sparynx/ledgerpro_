import React from 'react';
import { Mail, Github, ExternalLink } from 'lucide-react';

const AboutPage = () => {
  // Configuration object for easy customization
  const aboutConfig = {
    project: {
      name: "LedgerPro",
      description: "A modern financial management platform designed for CDS groups and organizations. It helps you track contributions, manage expenses, and generate transparent reports with ease and security."
    },
    creator: {
      name: "Adebisi Timileyin S.",
      email: "adebisitimileyin23@gmail.com",
      github: "sparynx"
    },
    mission: "To empower CDS groups with simple, secure, and transparent financial tools, making group management stress-free and trustworthy for everyone.",
    contactPage: "/contact"
  };

  type ContactLinkProps = {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
    external?: boolean;
  };

  const ContactLink: React.FC<ContactLinkProps> = ({ href, icon: Icon, children, external = false }) => (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-all duration-200 group"
    >
      <Icon className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
      <span className="font-medium">{children}</span>
      {external && <ExternalLink className="w-4 h-4 opacity-50" />}
    </a>
  );

  type SectionProps = {
    title: string;
    children: React.ReactNode;
    className?: string;
  };

  const Section: React.FC<SectionProps> = ({ title, children, className = "" }) => (
    <div className={`space-y-3 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
        {title}
      </h2>
      <div className="text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-first container with proper spacing */}
      <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              About {aboutConfig.project.name}
            </h1>
            <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>

          {/* Main content card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8 space-y-8">
              {/* Project Description */}
              <Section title="What is this project?">
                <p className="text-lg">
                  <span className="font-semibold text-blue-600">{aboutConfig.project.name}</span>{' '}
                  {aboutConfig.project.description.replace(aboutConfig.project.name, '').trim()}
                </p>
              </Section>

              {/* Support / Donation */}
              <Section title="Support the Project">
                <div className="space-y-4">
                  <p className="text-lg">
                    LedgerPro is built for transparency and community impact. Your support helps us keep servers running, ship new features faster, and provide a reliable tool for CDS groups across the country.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Keep the platform fast, secure, and ad‑free</li>
                    <li>Fund new features requested by the community</li>
                    <li>Support ongoing maintenance and sustainability</li>
                  </ul>
                  <div className="mt-3">
                    <a
                      href="https://wa.me/2349059543322?text=Hi%20LedgerPro%2C%20I%20would%20like%20to%20support%20the%20project."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium shadow-sm transition-colors w-full sm:w-auto justify-center"
                      aria-label="Message on WhatsApp to support LedgerPro"
                    >
                      {/* WhatsApp Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0c-6.63.03-12 5.4-12 12.03 0 2.12.55 4.19 1.6 6.02L0 24l6.1-1.6a12 12 0 0 0 5.9 1.56h.01c6.63 0 12-5.37 12.03-12a11.94 11.94 0 0 0-3.52-8.48ZM12 21.06c-1.9 0-3.74-.5-5.36-1.46l-.38-.23-3.62.95.97-3.53-.25-.39A9.07 9.07 0 0 1 2.94 12C2.92 7.5 6.55 3.88 11.05 3.86h.02c2.41 0 4.67.94 6.37 2.64a9.02 9.02 0 0 1 2.66 6.38c-.02 4.5-3.66 8.18-8.1 8.18Zm4.73-6.06c-.26-.13-1.54-.76-1.78-.84-.24-.09-.41-.13-.58.13-.17.25-.66.83-.81 1-.15.17-.3.2-.56.07-.26-.13-1.1-.41-2.1-1.3-.78-.69-1.3-1.53-1.45-1.79-.15-.26-.02-.4.11-.53.12-.12.26-.33.39-.5.13-.17.17-.3.26-.5.09-.2.04-.38-.02-.53-.07-.13-.58-1.4-.8-1.92-.21-.51-.42-.44-.58-.45h-.5c-.17 0-.45.06-.68.33-.24.26-.9.88-.9 2.14 0 1.26.92 2.48 1.05 2.65.13.17 1.82 2.78 4.4 3.9.62.27 1.11.43 1.49.55.63.2 1.2.17 1.65.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.06-.11-.23-.17-.49-.3Z" />
                      </svg>
                      <span>Message on WhatsApp</span>
                      <span className="ml-1 text-white/80 text-sm">(0905****322)</span>
                    </a>
                    <p className="mt-2 text-xs text-gray-500">We appreciate any contribution — thank you for helping keep LedgerPro sustainable.</p>
                  </div>
                </div>
              </Section>

              {/* Creator */}
              <Section title="Creator">
                <p className="text-lg font-medium text-gray-900">
                  {aboutConfig.creator.name}
                </p>
              </Section>

              {/* Mission */}
              <Section title="Our Mission">
                <p className="text-lg">
                  {aboutConfig.mission}
                </p>
              </Section>

              {/* Contact */}
              <Section title="Get in Touch">
                <div className="grid gap-4 sm:grid-cols-2">
                  <ContactLink 
                    href={`mailto:${aboutConfig.creator.email}`} 
                    icon={Mail}
                  >
                    Email Us
                  </ContactLink>
                  <ContactLink 
                    href={`https://github.com/${aboutConfig.creator.github}`} 
                    icon={Github}
                    external
                  >
                    View on GitHub
                  </ContactLink>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">2025 Executive Committee (EXCO)</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">State Code</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Position</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Phone</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="px-4 py-2">Anifowose Anjolaoluwa Mary</td>
                          <td className="px-4 py-2">FC/25A/11285</td>
                          <td className="px-4 py-2">President</td>
                          <td className="px-4 py-2 text-gray-400 italic">(number)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Adetunji Adeoluwa Samuel</td>
                          <td className="px-4 py-2">FC/25A/6288</td>
                          <td className="px-4 py-2">Vice President</td>
                          <td className="px-4 py-2 text-gray-400 italic">(number)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Ugo Oluodu Mary</td>
                          <td className="px-4 py-2">FC/25A/11684</td>
                          <td className="px-4 py-2">General Secretary</td>
                          <td className="px-4 py-2 text-gray-400 italic">(number)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Adebisi Timileyin Sodiq</td>
                          <td className="px-4 py-2">FC/25A/11981</td>
                          <td className="px-4 py-2">Financial Secretary</td>
                          <td className="px-4 py-2 text-gray-400 italic">(number)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Yakubu Kamaldeen</td>
                          <td className="px-4 py-2">FC/25A/12425</td>
                          <td className="px-4 py-2">Treasurer</td>
                          <td className="px-4 py-2 text-gray-400 italic">(number)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Nnamani Nwanne Patrice</td>
                          <td className="px-4 py-2">FC/25A/7374</td>
                          <td className="px-4 py-2">Welfare Secretary</td>
                          <td className="px-4 py-2 text-gray-400 italic">(number)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Yamah David Adiomokhai</td>
                          <td className="px-4 py-2">FC/25A/12407</td>
                          <td className="px-4 py-2">PRO</td>
                          <td className="px-4 py-2 text-gray-400 italic">(number)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Becky Peter Uba</td>
                          <td className="px-4 py-2">FC/25A/8876</td>
                          <td className="px-4 py-2">-</td>
                          <td className="px-4 py-2 text-gray-400 italic">(number)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">Phone numbers will be added soon.</div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Need support?</span>{' '}
                    Visit our{' '}
                    <a 
                      href={aboutConfig.contactPage} 
                      className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
                    >
                      contact page
                    </a>{' '}
                    for detailed inquiries.
                  </p>
                </div>
              </Section>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>Built with care for the community</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;