import React from 'react';


function AboutUs() {
  return (
    <div
    className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
    style={{ backgroundImage: "url('loan_homepage.jpg')" }}
  >
    {/* Background Overlay */}
    <div className="absolute inset-0 bg-black opacity-50"></div>
  
    {/* Content Section */}
    <div className="relative max-w-4xl mx-auto p-6 bg-white/70 backdrop-blur-md rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">About Us</h1>
        <div className="h-1 w-20 bg-rose-400 mx-auto mt-2"></div>
      </div>
  
      <p className="mb-6 text-gray-700">
        Welcome to <strong className="text-gray-800">Yangu Mkopo</strong>, your trusted partner in financial solutions. We are dedicated to providing a seamless and efficient loan management experience tailored to meet the diverse needs of our customers.
      </p>
  
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Mission</h2>
          <p className="text-gray-700">
            At Yangu Mkopo, our mission is to empower individuals and businesses by offering accessible and flexible loan options. We believe that everyone deserves financial support, and we strive to make the borrowing process simple, transparent, and fair.
          </p>
        </section>
  
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Who We Are</h2>
          <p className="text-gray-700">
            Founded by a team of financial experts and technology enthusiasts, Yangu Mkopo combines years of industry experience with innovative technology to create a platform that enhances the borrowing experience. Our goal is to bridge the gap between lenders and borrowers, ensuring that your financial needs are met promptly and responsibly.
          </p>
        </section>
  
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">What We Offer</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <strong>Personal Loans:</strong> Quick and easy personal loan solutions for individuals seeking to meet their financial goals.
            </li>
            <li>
              <strong>Business Loans:</strong> Tailored loan options designed for startups and established businesses.
            </li>
            <li>
              <strong>Transparent Terms:</strong> Clear terms, competitive interest rates, and no hidden fees.
            </li>
            <li>
              <strong>User-Friendly Platform:</strong> Manage your loans from anywhere, anytime with our digital platform.
            </li>
          </ul>
        </section>
  
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Values</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <strong>Customer-Centric:</strong> We put our customers at the heart of everything we do.
            </li>
            <li>
              <strong>Integrity:</strong> Adhering to the highest standards of honesty and ethics.
            </li>
            <li>
              <strong>Innovation:</strong> Continuously seeking new ways to improve our services.
            </li>
          </ul>
        </section>
  
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Join Us</h2>
          <p className="text-gray-700">
            Whether you're looking to apply for a loan or seeking support in managing your finances, Yangu Mkopo is here to help. Together, let's build a financially secure future.
          </p>
        </section>
  
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Contact Us</h2>
          <p className="text-gray-700">
            For any inquiries or assistance, please feel free to reach out to our dedicated support team at
            <a href="mailto:support@yangu.mkopo" className="text-rose-400 underline">
              {" "}
              support@yangu.mkopo
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  </div>
  
  );
}

export default AboutUs;
