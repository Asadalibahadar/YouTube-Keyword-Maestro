import React from 'react';

interface AdvancedControlsProps {
  topic: string;
  country: string;
  setCountry: (country: string) => void;
  filterType: 'all' | 'containing';
  setFilterType: (filter: 'all' | 'containing') => void;
  minVolume: string;
  setMinVolume: (value: string) => void;
  maxDifficulty: string;
  setMaxDifficulty: (value: string) => void;
  minLength: string;
  setMinLength: (value: string) => void;
  maxLength: string;
  setMaxLength: (value: string) => void;
  includeWords: string;
  setIncludeWords: (value: string) => void;
  excludeWords: string;
  setExcludeWords: (value: string) => void;
  onExport: () => void;
}

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
  'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo, Democratic Republic of the', 'Congo, Republic of the', 'Costa Rica', "Cote d'Ivoire", 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
  'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
  'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
  "Lao People's Democratic Republic", 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia, Federated States of', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
  'Oman',
  'Pakistan', 'Palau', 'Palestine State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar',
  'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
  'Yemen',
  'Zambia', 'Zimbabwe'
];

const inputClass = "w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition";
const labelClass = "block text-sm font-medium text-gray-300 mb-1";


const AdvancedControls: React.FC<AdvancedControlsProps> = (props) => {
  const { topic } = props;
  if (!topic) return null;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Country Select */}
            <div>
                <label htmlFor="country-select" className={labelClass}>Target Country</label>
                <select id="country-select" value={props.country} onChange={e => props.setCountry(e.target.value)} className={inputClass}>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Keyword Type Filter */}
            <div>
                <label className={labelClass}>Keyword Type</label>
                <div className="flex space-x-2 bg-gray-700 p-1 rounded-md border border-gray-600 h-10">
                    <button onClick={() => props.setFilterType('all')} className={`w-1/2 text-sm rounded px-1 ${props.filterType === 'all' ? 'bg-purple-600 text-white' : 'hover:bg-gray-600'}`} aria-pressed={props.filterType === 'all'}>Related</button>
                    <button onClick={() => props.setFilterType('containing')} className={`w-1/2 text-sm rounded px-1 truncate ${props.filterType === 'containing' ? 'bg-purple-600 text-white' : 'hover:bg-gray-600'}`} aria-pressed={props.filterType === 'containing'}>Containing "{topic}"</button>
                </div>
            </div>

            {/* Keyword Length */}
            <div className="md:col-span-2 lg:col-span-1">
                <label className={labelClass}>Word Count</label>
                <div className="flex items-center space-x-2">
                    <input type="number" placeholder="Min" value={props.minLength} onChange={e => props.setMinLength(e.target.value)} className={inputClass} />
                    <span className="text-gray-400">-</span>
                    <input type="number" placeholder="Max" value={props.maxLength} onChange={e => props.setMaxLength(e.target.value)} className={inputClass} />
                </div>
            </div>

            {/* Search Volume */}
            <div>
                <label htmlFor="min-volume" className={labelClass}>Min Search Volume</label>
                <input id="min-volume" type="number" placeholder="e.g., 1000" value={props.minVolume} onChange={e => props.setMinVolume(e.target.value)} className={inputClass} />
            </div>

            {/* Competition */}
            <div>
                <label htmlFor="max-difficulty" className={labelClass}>Max Competition (1-100)</label>
                <input id="max-difficulty" type="number" placeholder="e.g., 50" value={props.maxDifficulty} onChange={e => props.setMaxDifficulty(e.target.value)} className={inputClass} max="100" />
            </div>
            
            {/* Include/Exclude Words */}
            <div className="md:col-span-2">
                 <label className={labelClass}>Include Words</label>
                 <input type="text" placeholder="e.g., tutorial, for beginners (comma-separated)" value={props.includeWords} onChange={e => props.setIncludeWords(e.target.value)} className={inputClass} />
            </div>
             <div className="md:col-span-2">
                 <label className={labelClass}>Exclude Words</label>
                 <input type="text" placeholder="e.g., 2022, free (comma-separated)" value={props.excludeWords} onChange={e => props.setExcludeWords(e.target.value)} className={inputClass} />
            </div>
            
            {/* Export Button */}
             <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                <button
                    onClick={props.onExport}
                    className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
                >
                    Export to CSV
                </button>
            </div>
        </div>
    </div>
  );
};

const animationStyle = `
  @keyframes fade-in {
    0% { opacity: 0; transform: translateY(-10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;

const AdvancedControlsWithAnimation: React.FC<AdvancedControlsProps> = (props) => (
  <>
    <style>{animationStyle}</style>
    <AdvancedControls {...props} />
  </>
);

export default AdvancedControlsWithAnimation;