<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LeadsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leads = [];

        // Helper function to randomly assign social media
        $getSocialMedia = function($companyName, $hasWebsite, $digitalPresence = 'medium') {
            $social = [
                'facebook' => null,
                'linkedin' => null,
                'instagram' => null,
                'twitter' => null,
            ];

            $slug = strtolower(str_replace([' ', 'SIA', 'UAB', 'AS', ',', '.'], ['', '', '', '', '', ''], $companyName));

            if ($digitalPresence === 'high') {
                $social['facebook'] = 'https://facebook.com/' . $slug;
                $social['linkedin'] = 'https://linkedin.com/company/' . $slug;
                $social['instagram'] = rand(0, 10) > 3 ? 'https://instagram.com/' . $slug : null;
                $social['twitter'] = rand(0, 10) > 4 ? 'https://twitter.com/' . $slug : null;
            } elseif ($digitalPresence === 'medium' && $hasWebsite) {
                $social['facebook'] = rand(0, 10) > 4 ? 'https://facebook.com/' . $slug : null;
                $social['linkedin'] = rand(0, 10) > 5 ? 'https://linkedin.com/company/' . $slug : null;
                $social['instagram'] = rand(0, 10) > 7 ? 'https://instagram.com/' . $slug : null;
            } elseif ($digitalPresence === 'low') {
                $social['facebook'] = rand(0, 10) > 8 ? 'https://facebook.com/' . $slug : null;
            }

            return $social;
        };

        // Large corporations (high digital presence)
        $largeCorporations = [
            ['Rīgas Tehno Grupa', 'Technology', 'Rīga', 'Latvia', 2500, 'Large tech conglomerate', 'high'],
            ['Baltic Digital Solutions', 'Technology', 'Tallinn', 'Estonia', 1800, 'Leading IT services provider', 'high'],
            ['Vilnius Manufacturing Corp', 'Manufacturing', 'Vilnius', 'Lithuania', 3200, 'Industrial manufacturing company', 'high'],
            ['Nordic Energy Systems', 'Energy', 'Rīga', 'Latvia', 4500, 'Renewable energy solutions', 'high'],
            ['Baltic Logistics International', 'Logistics', 'Tallinn', 'Estonia', 2800, 'International shipping and logistics', 'high'],
        ];

        foreach ($largeCorporations as $index => $company) {
            $country = $company[3];
            $regType = $country === 'Latvia' ? 'SIA' : ($country === 'Lithuania' ? 'UAB' : 'AS');
            $domain = $country === 'Latvia' ? '.lv' : ($country === 'Lithuania' ? '.lt' : '.ee');
            $phonePrefix = $country === 'Latvia' ? '+371 6' : ($country === 'Lithuania' ? '+370 6' : '+372 6');
            
            $slug = strtolower(str_replace([' ', ',', '.'], ['', '', ''], $company[0]));
            $social = $getSocialMedia($company[0], true, $company[6]);
            
            $leads[] = [
                'business_name' => $regType . ' ' . $company[0],
                'reg_type' => $regType,
                'registration_number' => ($country === 'Latvia' ? '4000' : ($country === 'Lithuania' ? '30' : '1')) . str_pad($index + 1000, 7, '0', STR_PAD_LEFT),
                'email' => 'info@' . $slug . $domain,
                'phone_number' => $phonePrefix . rand(100000, 999999),
                'website' => 'https://www.' . $slug . $domain,
                'facebook' => $social['facebook'],
                'linkedin' => $social['linkedin'],
                'instagram' => $social['instagram'],
                'twitter' => $social['twitter'],
                'address' => 'Business Center, ' . $company[2],
                'city' => $company[2],
                'country' => $country,
                'industry' => $company[1],
                'description' => $company[5],
                'profitable' => true,
                'employee_count' => $company[4],
                'founded_date' => Carbon::create(rand(1995, 2005), rand(1, 12), rand(1, 28)),
                'source' => $country === 'Latvia' ? 'firmas.lv' : ($country === 'Lithuania' ? 'rekvizitai.vz.lt' : 'ariregister.rik.ee'),
                'confidence_score' => rand(90, 98),
                'last_verified_at' => now(),
            ];
        }

        // Medium companies (medium digital presence)
        $mediumCompanies = [
            ['Riga Coffee Roasters', 'Food & Beverage', 'Rīga', 'Latvia', 45, 'Specialty coffee roasting company'],
            ['Estonian Wood Crafters', 'Manufacturing', 'Tartu', 'Estonia', 80, 'Custom wooden furniture manufacturer'],
            ['Vilnius Design Studio', 'Creative Services', 'Vilnius', 'Lithuania', 25, 'Graphic design and branding agency'],
            ['Baltic Auto Service', 'Automotive', 'Daugavpils', 'Latvia', 35, 'Car repair and maintenance services'],
            ['Tallinn Web Agency', 'Technology', 'Tallinn', 'Estonia', 18, 'Web development and digital marketing'],
            ['Kaunas Construction', 'Construction', 'Kaunas', 'Lithuania', 120, 'Residential and commercial construction'],
            ['Liepāja Fish Market', 'Food & Beverage', 'Liepāja', 'Latvia', 28, 'Fresh seafood supplier'],
            ['Pärnu Holiday Rentals', 'Tourism', 'Pärnu', 'Estonia', 12, 'Vacation rental management'],
            ['Šiauliai Printing House', 'Printing', 'Šiauliai', 'Lithuania', 55, 'Commercial printing services'],
            ['Ventspils Marine Services', 'Maritime', 'Ventspils', 'Latvia', 90, 'Ship maintenance and repair'],
        ];

        foreach ($mediumCompanies as $index => $company) {
            $country = $company[3];
            $regType = $country === 'Latvia' ? 'SIA' : ($country === 'Lithuania' ? 'UAB' : 'AS');
            $domain = $country === 'Latvia' ? '.lv' : ($country === 'Lithuania' ? '.lt' : '.ee');
            $phonePrefix = $country === 'Latvia' ? '+371 6' : ($country === 'Lithuania' ? '+370 6' : '+372 6');
            
            $hasWebsite = rand(0, 10) > 2; // 80% have websites
            $slug = strtolower(str_replace([' ', ',', '.'], ['', '', ''], $company[0]));
            $social = $getSocialMedia($company[0], $hasWebsite, 'medium');
            
            $leads[] = [
                'business_name' => $regType . ' ' . $company[0],
                'reg_type' => $regType,
                'registration_number' => ($country === 'Latvia' ? '4000' : ($country === 'Lithuania' ? '30' : '1')) . str_pad($index + 2000, 7, '0', STR_PAD_LEFT),
                'email' => rand(0, 10) > 1 ? 'info@' . $slug . $domain : null, // 90% have email
                'phone_number' => $phonePrefix . rand(100000, 999999),
                'website' => $hasWebsite ? 'https://www.' . $slug . $domain : null,
                'facebook' => $social['facebook'],
                'linkedin' => $social['linkedin'],
                'instagram' => $social['instagram'],
                'twitter' => $social['twitter'],
                'address' => rand(1, 50) . ' ' . ['Main St', 'Central Ave', 'Business St', 'Industrial Rd'][rand(0, 3)] . ', ' . $company[2],
                'city' => $company[2],
                'country' => $country,
                'industry' => $company[1],
                'description' => $company[5],
                'profitable' => rand(0, 10) > 2, // 80% profitable
                'employee_count' => $company[4],
                'founded_date' => Carbon::create(rand(2000, 2015), rand(1, 12), rand(1, 28)),
                'source' => rand(0, 10) > 7 ? 'manual' : ($country === 'Latvia' ? 'firmas.lv' : ($country === 'Lithuania' ? 'rekvizitai.vz.lt' : 'ariregister.rik.ee')),
                'confidence_score' => rand(70, 90),
                'last_verified_at' => rand(0, 10) > 3 ? now() : Carbon::now()->subDays(rand(30, 180)),
            ];
        }

        // Small businesses (low digital presence)
        $smallBusinesses = [
            ['Jānis Garage', 'Automotive', 'Jelgava', 'Latvia', 3, 'Small car repair shop'],
            ['Mārtiņš Bakery', 'Food & Beverage', 'Valmiera', 'Latvia', 8, 'Traditional bread and pastries'],
            ['Rasa Hair Salon', 'Beauty', 'Panevėžys', 'Lithuania', 5, 'Hair styling and beauty services'],
            ['Petras Carpentry', 'Construction', 'Klaipėda', 'Lithuania', 4, 'Custom woodworking and repairs'],
            ['Kristi Flower Shop', 'Retail', 'Pärnu', 'Estonia', 2, 'Fresh flowers and arrangements'],
            ['Andris Plumbing', 'Services', 'Liepāja', 'Latvia', 6, 'Residential plumbing services'],
            ['Ona Cleaning Service', 'Services', 'Vilnius', 'Lithuania', 12, 'Professional cleaning services'],
            ['Toomas Electronics', 'Retail', 'Tartu', 'Estonia', 3, 'Electronics repair and sales'],
            ['Silva Accounting', 'Professional Services', 'Rīga', 'Latvia', 7, 'Small business accounting'],
            ['Mindaugas Transport', 'Transportation', 'Kaunas', 'Lithuania', 15, 'Local delivery services'],
            ['Kadri Photography', 'Creative Services', 'Tallinn', 'Estonia', 1, 'Wedding and event photography'],
            ['Edvards Farm', 'Agriculture', 'Bauska', 'Latvia', 9, 'Organic vegetables and dairy'],
            ['Jolanta Catering', 'Food & Beverage', 'Šiauliai', 'Lithuania', 6, 'Event catering services'],
            ['Peeter Taxi', 'Transportation', 'Viljandi', 'Estonia', 4, 'Local taxi service'],
            ['Zenta Craft Shop', 'Retail', 'Cēsis', 'Latvia', 2, 'Handmade crafts and souvenirs'],
        ];

        foreach ($smallBusinesses as $index => $company) {
            $country = $company[3];
            $regType = rand(0, 10) > 7 ? ($country === 'Latvia' ? 'SIA' : ($country === 'Lithuania' ? 'UAB' : 'AS')) : null; // Some don't have formal registration
            $domain = $country === 'Latvia' ? '.lv' : ($country === 'Lithuania' ? '.lt' : '.ee');
            $phonePrefix = $country === 'Latvia' ? '+371 2' : ($country === 'Lithuania' ? '+370 6' : '+372 5'); // Mobile numbers
            
            $hasWebsite = rand(0, 10) > 7; // Only 30% have websites
            $hasEmail = rand(0, 10) > 4; // 60% have email
            $slug = strtolower(str_replace([' ', ',', '.'], ['', '', ''], $company[0]));
            $social = $getSocialMedia($company[0], $hasWebsite, 'low');
            
            $leads[] = [
                'business_name' => ($regType ? $regType . ' ' : '') . $company[0],
                'reg_type' => $regType,
                'registration_number' => $regType ? (($country === 'Latvia' ? '4000' : ($country === 'Lithuania' ? '30' : '1')) . str_pad($index + 3000, 7, '0', STR_PAD_LEFT)) : null,
                'email' => $hasEmail ? (rand(0, 10) > 5 ? 'info@' . $slug . $domain : $slug . '@gmail.com') : null,
                'phone_number' => $phonePrefix . rand(1000000, 9999999),
                'website' => $hasWebsite ? 'https://www.' . $slug . $domain : null,
                'facebook' => $social['facebook'],
                'linkedin' => $social['linkedin'],
                'instagram' => $social['instagram'],
                'twitter' => $social['twitter'],
                'address' => rand(1, 200) . ' ' . ['Street', 'Avenue', 'Road', 'Lane'][rand(0, 3)] . ', ' . $company[2],
                'city' => $company[2],
                'country' => $country,
                'industry' => $company[1],
                'description' => $company[5],
                'profitable' => rand(0, 10) > 3, // 70% profitable
                'employee_count' => $company[4],
                'founded_date' => Carbon::create(rand(2005, 2020), rand(1, 12), rand(1, 28)),
                'source' => ['manual', 'referral', 'local directory'][rand(0, 2)],
                'confidence_score' => rand(50, 80),
                'last_verified_at' => rand(0, 10) > 5 ? now() : Carbon::now()->subDays(rand(60, 365)),
            ];
        }

        // Startups and new companies (varying digital presence)
        $startups = [
            ['GreenTech Innovations', 'Technology', 'Rīga', 'Latvia', 12, 'Sustainable technology solutions', 'high'],
            ['FinanceBot', 'Fintech', 'Tallinn', 'Estonia', 8, 'AI-powered financial assistant', 'high'],
            ['EcoFarm Solutions', 'Agriculture', 'Vilnius', 'Lithuania', 15, 'Smart farming technology', 'medium'],
            ['Baltic Drones', 'Technology', 'Rīga', 'Latvia', 6, 'Commercial drone services', 'medium'],
            ['VR Games Studio', 'Entertainment', 'Tallinn', 'Estonia', 10, 'Virtual reality game development', 'high'],
            ['CloudSync Pro', 'Technology', 'Vilnius', 'Lithuania', 4, 'Cloud storage solutions', 'medium'],
            ['SmartHome Baltic', 'Technology', 'Rīga', 'Latvia', 7, 'Home automation systems', 'medium'],
            ['FoodTech Delivery', 'Food & Beverage', 'Tallinn', 'Estonia', 20, 'Food delivery platform', 'high'],
            ['CryptoBaltic', 'Fintech', 'Vilnius', 'Lithuania', 5, 'Cryptocurrency exchange', 'low'], // Intentionally low presence
            ['HealthApp Solutions', 'Healthcare', 'Rīga', 'Latvia', 9, 'Mobile health applications', 'high'],
        ];

        foreach ($startups as $index => $company) {
            $country = $company[3];
            $regType = $country === 'Latvia' ? 'SIA' : ($country === 'Lithuania' ? 'UAB' : 'AS');
            $domain = $country === 'Latvia' ? '.lv' : ($country === 'Lithuania' ? '.lt' : '.ee');
            $phonePrefix = $country === 'Latvia' ? '+371 2' : ($country === 'Lithuania' ? '+370 6' : '+372 5');
            
            $slug = strtolower(str_replace([' ', ',', '.'], ['', '', ''], $company[0]));
            $social = $getSocialMedia($company[0], true, $company[6]);
            
            $leads[] = [
                'business_name' => $regType . ' ' . $company[0],
                'reg_type' => $regType,
                'registration_number' => ($country === 'Latvia' ? '4000' : ($country === 'Lithuania' ? '30' : '1')) . str_pad($index + 4000, 7, '0', STR_PAD_LEFT),
                'email' => 'hello@' . $slug . $domain,
                'phone_number' => $phonePrefix . rand(1000000, 9999999),
                'website' => 'https://www.' . $slug . $domain,
                'facebook' => $social['facebook'],
                'linkedin' => $social['linkedin'],
                'instagram' => $social['instagram'],
                'twitter' => $social['twitter'],
                'address' => 'Startup Hub, ' . $company[2],
                'city' => $company[2],
                'country' => $country,
                'industry' => $company[1],
                'description' => $company[5],
                'profitable' => rand(0, 10) > 6, // 40% profitable (startups often not profitable initially)
                'employee_count' => $company[4],
                'founded_date' => Carbon::create(rand(2018, 2023), rand(1, 12), rand(1, 28)),
                'source' => ['crunchbase', 'startup directory', 'manual'][rand(0, 2)],
                'confidence_score' => rand(80, 95),
                'last_verified_at' => Carbon::now()->subDays(rand(1, 30)),
            ];
        }

        // Traditional/older companies (minimal digital presence)
        $traditionalCompanies = [
            ['Old Town Pharmacy', 'Healthcare', 'Rīga', 'Latvia', 25, 'Traditional pharmacy serving local community'],
            ['Heritage Bookstore', 'Retail', 'Tallinn', 'Estonia', 8, 'Independent bookstore with rare books'],
            ['Traditional Tailoring', 'Fashion', 'Vilnius', 'Lithuania', 12, 'Custom clothing and alterations'],
            ['Village Mill', 'Food & Beverage', 'Sigulda', 'Latvia', 18, 'Traditional grain milling operation'],
            ['Antique Furniture Restoration', 'Services', 'Tartu', 'Estonia', 6, 'Furniture restoration and repair'],
            ['Local Hardware Store', 'Retail', 'Panevėžys', 'Lithuania', 14, 'Traditional hardware and tools'],
            ['Family Restaurant', 'Food & Beverage', 'Cēsis', 'Latvia', 22, 'Traditional Latvian cuisine'],
            ['Corner Grocery', 'Retail', 'Pärnu', 'Estonia', 7, 'Small neighborhood grocery store'],
            ['Traditional Blacksmith', 'Manufacturing', 'Kaunas', 'Lithuania', 3, 'Custom metalwork and repair'],
            ['Old School Printing', 'Printing', 'Valmiera', 'Latvia', 16, 'Traditional printing services'],
        ];

        foreach ($traditionalCompanies as $index => $company) {
            $country = $company[3];
            $regType = rand(0, 10) > 5 ? ($country === 'Latvia' ? 'SIA' : ($country === 'Lithuania' ? 'UAB' : 'AS')) : null;
            $phonePrefix = $country === 'Latvia' ? '+371 6' : ($country === 'Lithuania' ? '+370 3' : '+372 4'); // Landline numbers
            
            $hasEmail = rand(0, 10) > 6; // Only 40% have email
            $slug = strtolower(str_replace([' ', ',', '.'], ['', '', ''], $company[0]));
            
            $leads[] = [
                'business_name' => ($regType ? $regType . ' ' : '') . $company[0],
                'reg_type' => $regType,
                'registration_number' => $regType ? (($country === 'Latvia' ? '4000' : ($country === 'Lithuania' ? '30' : '1')) . str_pad($index + 5000, 7, '0', STR_PAD_LEFT)) : null,
                'email' => $hasEmail ? $slug . '@inbox.lv' : null, // Using local email providers
                'phone_number' => $phonePrefix . rand(100000, 999999),
                'website' => null, // No websites
                'facebook' => null,
                'linkedin' => null,
                'instagram' => null,
                'twitter' => null,
                'address' => rand(1, 100) . ' Old Town, ' . $company[2],
                'city' => $company[2],
                'country' => $country,
                'industry' => $company[1],
                'description' => $company[5],
                'profitable' => rand(0, 10) > 3, // 70% profitable
                'employee_count' => $company[4],
                'founded_date' => Carbon::create(rand(1960, 1995), rand(1, 12), rand(1, 28)),
                'source' => ['local directory', 'manual', 'referral'][rand(0, 2)],
                'confidence_score' => rand(40, 70),
                'last_verified_at' => Carbon::now()->subDays(rand(180, 730)), // Less frequently verified
            ];
        }

        // Add some companies with incomplete/missing data
        $incompleteCompanies = [
            ['Mystery Tech Corp', 'Technology', 'Rīga', 'Latvia', null, null], // Missing employee count and description
            ['Unknown Services', 'Services', 'Vilnius', 'Lithuania', 45, 'Business services company'], // Will have missing contact info
            ['Phantom Logistics', 'Logistics', 'Tallinn', 'Estonia', 120, null], // Missing description
            ['Stealth Startup', 'Technology', 'Rīga', 'Latvia', null, 'Stealth mode startup'], // Missing employee count
            ['Data Missing Co', 'Consulting', 'Kaunas', 'Lithuania', 30, 'Consulting services'], // Will have missing verification
        ];

        foreach ($incompleteCompanies as $index => $company) {
            $country = $company[3];
            $regType = $country === 'Latvia' ? 'SIA' : ($country === 'Lithuania' ? 'UAB' : 'AS');
            
            $leads[] = [
                'business_name' => $regType . ' ' . $company[0],
                'reg_type' => $regType,
                'registration_number' => ($country === 'Latvia' ? '4000' : ($country === 'Lithuania' ? '30' : '1')) . str_pad($index + 6000, 7, '0', STR_PAD_LEFT),
                'email' => rand(0, 10) > 5 ? null : 'contact@' . strtolower(str_replace(' ', '', $company[0])) . '.com', // 50% missing email
                'phone_number' => rand(0, 10) > 3 ? null : '+371 2' . rand(1000000, 9999999), // 70% missing phone
                'website' => null,
                'facebook' => null,
                'linkedin' => null,
                'instagram' => null,
                'twitter' => null,
                'address' => rand(0, 10) > 4 ? null : 'Unknown Location, ' . $company[2], // 60% missing address
                'city' => $company[2],
                'country' => $country,
                'industry' => $company[1],
                'description' => $company[5],
                'profitable' => null, // Unknown profitability
                'employee_count' => $company[4],
                'founded_date' => rand(0, 10) > 6 ? null : Carbon::create(rand(2010, 2020), rand(1, 12), rand(1, 28)),
                'source' => 'scrape',
                'confidence_score' => rand(20, 50), // Low confidence due to missing data
                'last_verified_at' => null, // Never verified
            ];
        }

        // Generate additional random companies to reach ~200 total
        $additionalIndustries = ['Retail', 'Manufacturing', 'Services', 'Construction', 'Healthcare', 'Education', 'Agriculture', 'Tourism'];
        $cities = [
            'Latvia' => ['Rīga', 'Daugavpils', 'Liepāja', 'Jelgava', 'Jūrmala', 'Valmiera', 'Rēzekne', 'Ventspils'],
            'Lithuania' => ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Alytus', 'Marijampolė', 'Mažeikiai'],
            'Estonia' => ['Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Kohtla-Järve', 'Viljandi', 'Rakvere', 'Sillamäe']
        ];

        $companyNames = [
            'Nordic Solutions', 'Baltic Ventures', 'Digital Dynamics', 'Prime Services', 'Elite Systems',
            'Urban Concepts', 'Modern Innovations', 'Global Connect', 'Smart Solutions', 'Future Tech',
            'Central Trading', 'Premium Quality', 'Express Delivery', 'Professional Group', 'Creative Labs',
            'Efficient Operations', 'Reliable Partners', 'Strategic Consulting', 'Advanced Analytics', 'Eco Solutions'
        ];

        for ($i = 0; $i < 150; $i++) { // Generate 150 more to reach ~200 total
            $countries = ['Latvia', 'Lithuania', 'Estonia'];
            $country = $countries[array_rand($countries)];
            $regType = $country === 'Latvia' ? 'SIA' : ($country === 'Lithuania' ? 'UAB' : 'AS');
            $domain = $country === 'Latvia' ? '.lv' : ($country === 'Lithuania' ? '.lt' : '.ee');
            $city = $cities[$country][array_rand($cities[$country])];
            $industry = $additionalIndustries[array_rand($additionalIndustries)];
            $companyName = $companyNames[array_rand($companyNames)] . ' ' . rand(1, 99);
            
            $employeeCount = [5, 12, 25, 45, 80, 120, 200, 350, 500, 800][array_rand([5, 12, 25, 45, 80, 120, 200, 350, 500, 800])];
            $digitalPresence = $employeeCount > 100 ? 'high' : ($employeeCount > 25 ? 'medium' : 'low');
            
            $hasWebsite = ($digitalPresence === 'high') || ($digitalPresence === 'medium' && rand(0, 10) > 3) || ($digitalPresence === 'low' && rand(0, 10) > 7);
            $hasEmail = $hasWebsite || rand(0, 10) > 4;
            
            $slug = strtolower(str_replace([' ', ',', '.'], ['', '', ''], $companyName));
            $social = $getSocialMedia($companyName, $hasWebsite, $digitalPresence);
            
            $leads[] = [
                'business_name' => $regType . ' ' . $companyName,
                'reg_type' => $regType,
                'registration_number' => ($country === 'Latvia' ? '4000' : ($country === 'Lithuania' ? '30' : '1')) . str_pad($i + 7000, 7, '0', STR_PAD_LEFT),
                'email' => $hasEmail ? (rand(0, 10) > 2 ? 'info@' . $slug . $domain : $slug . '@gmail.com') : null,
                'phone_number' => rand(0, 10) > 1 ? (($country === 'Latvia' ? '+371 ' : ($country === 'Lithuania' ? '+370 ' : '+372 ')) . rand(60000000, 69999999)) : null,
                'website' => $hasWebsite ? 'https://www.' . $slug . $domain : null,
                'facebook' => $social['facebook'],
                'linkedin' => $social['linkedin'],
                'instagram' => $social['instagram'],
                'twitter' => $social['twitter'],
                'address' => rand(0, 10) > 2 ? (rand(1, 100) . ' ' . ['Main St', 'Business Ave', 'Industrial Rd', 'Central Blvd', 'Commerce St'][rand(0, 4)] . ', ' . $city) : null,
                'city' => $city,
                'country' => $country,
                'industry' => $industry,
                'description' => rand(0, 10) > 3 ? ('Company specializing in ' . strtolower($industry) . ' services') : null,
                'profitable' => rand(0, 10) > 3 ? (rand(0, 10) > 2) : null,
                'employee_count' => rand(0, 10) > 2 ? $employeeCount : null,
                'founded_date' => rand(0, 10) > 2 ? Carbon::create(rand(1995, 2022), rand(1, 12), rand(1, 28)) : null,
                'source' => ['manual', 'scrape', 'referral', 'linkedin', 'google'][rand(0, 4)],
                'confidence_score' => rand(30, 95),
                'last_verified_at' => rand(0, 10) > 4 ? Carbon::now()->subDays(rand(1, 365)) : null,
            ];
        }

        // Insert all leads into the database
        foreach (array_chunk($leads, 50) as $chunk) {
            DB::table('leads')->insert($chunk);
        }

        $this->command->info('Successfully seeded ' . count($leads) . ' diverse leads from Baltic countries!');
        $this->command->info('Data includes companies of various sizes with different levels of digital presence.');
    }
} 