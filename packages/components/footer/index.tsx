import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8">
            <div className="container mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h6 className="font-bold mb-4 text-white">Services</h6>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-blue-400 transition duration-300">Branding</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition duration-300">Design</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition duration-300">Marketing</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition duration-300">Advertisement</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="font-bold mb-4 text-white">Company</h6>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-blue-400 transition duration-300">About us</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition duration-300">Contact</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition duration-300">Jobs</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition duration-300">Press kit</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="font-bold mb-4 text-white">Legal</h6>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-blue-400 transition duration-300">Terms of use</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition duration-300">Privacy policy</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition duration-300">Cookie policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="font-bold mb-4 text-white">Newsletter</h6>
                        <form className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-8 text-center">
                    <p>&copy; 2023 Your Company. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}