"use client";

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

type FormStep = 'type' | 'details' | 'location' | 'media' | 'review' | 'success';

const ReportForm = () => {
  // Track if component is fully loaded - declare at the top
  const [isLoaded, setIsLoaded] = useState(false);

  const [step, setStep] = useState<FormStep>('type');
  const [reportType, setReportType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const formRef = useRef<HTMLDivElement>(null);
  const stepRefs = {
    type: useRef<HTMLDivElement>(null),
    details: useRef<HTMLDivElement>(null),
    location: useRef<HTMLDivElement>(null),
    media: useRef<HTMLDivElement>(null),
    review: useRef<HTMLDivElement>(null),
    success: useRef<HTMLDivElement>(null),
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);

      // Create preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  // Remove a file
  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviewUrls = [...previewUrls];

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);

    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  // Navigate to next step
  const nextStep = () => {
    switch (step) {
      case 'type':
        setStep('details');
        break;
      case 'details':
        setStep('location');
        break;
      case 'location':
        setStep('media');
        break;
      case 'media':
        setStep('review');
        break;
      case 'review':
        handleSubmit(new Event('submit') as any);
        break;
      default:
        break;
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    switch (step) {
      case 'details':
        setStep('type');
        break;
      case 'location':
        setStep('details');
        break;
      case 'media':
        setStep('location');
        break;
      case 'review':
        setStep('media');
        break;
      default:
        break;
    }
  };

  // Set initial state for all elements - client-side only
  useEffect(() => {
    if (!formRef.current || typeof window === 'undefined') return;

    // Hide all steps initially
    gsap.set(formRef.current, { opacity: 0 });

    Object.values(stepRefs).forEach(ref => {
      if (ref.current) {
        gsap.set(ref.current, { autoAlpha: 0, y: 20 });
      }
    });

    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      // Animate form in first
      gsap.to(formRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          // Then animate the current step
          const currentStepRef = stepRefs[step];
          if (currentStepRef.current) {
            gsap.to(currentStepRef.current, {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out"
            });
          }
        }
      });
    }, 100);
  }, []);

  // Animate step transitions - client-side only
  useEffect(() => {
    if (!formRef.current || !isLoaded || typeof window === 'undefined') return;

    // Hide all steps except current
    Object.values(stepRefs).forEach(ref => {
      if (ref.current && ref !== stepRefs[step]) {
        gsap.set(ref.current, { autoAlpha: 0, y: 20 });
      }
    });

    // Show current step with a nice animation
    const currentStepRef = stepRefs[step];
    if (currentStepRef.current) {
      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        gsap.to(currentStepRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.2)"
        });
      }, 50);
    }
  }, [step, isLoaded]);

  // Initialize isLoaded state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoaded(true);
    }
  }, []);

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div ref={formRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {['type', 'details', 'location', 'media', 'review'].map((s, index) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === s
                  ? 'bg-indigo-600 text-white'
                  : ['success'].includes(step) || index < ['type', 'details', 'location', 'media', 'review'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 bg-indigo-600 rounded-full transition-all duration-300"
            style={{
              width: step === 'type'
                ? '20%'
                : step === 'details'
                  ? '40%'
                  : step === 'location'
                    ? '60%'
                    : step === 'media'
                      ? '80%'
                      : '100%'
            }}
          ></div>
        </div>
      </div>

      {/* Step 1: Report Type */}
      <div ref={stepRefs.type} className={`${step === 'type' ? 'block' : 'hidden'}`}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">What type of incident are you reporting?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Traffic Violation', 'Public Disturbance', 'Counterfeit Goods', 'Environmental Issue', 'Consumer Complaint', 'Other'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setReportType(type)}
              className={`p-4 border rounded-lg text-left transition-all ${
                reportType === type
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <span className="font-medium text-gray-800 dark:text-white">{type}</span>
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={nextStep}
            disabled={!reportType}
            className={`px-6 py-3 rounded-lg font-medium ${
              reportType
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>

      {/* Step 2: Report Details */}
      <div ref={stepRefs.details} className={`${step === 'details' ? 'block' : 'hidden'}`}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Describe the incident</h2>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
            rows={5}
            placeholder="Please provide as much detail as possible..."
          ></textarea>
        </div>
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 rounded-lg font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={!description}
            className={`px-6 py-3 rounded-lg font-medium ${
              description
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>

      {/* Step 3: Location */}
      <div ref={stepRefs.location} className={`${step === 'location' ? 'block' : 'hidden'}`}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Where did this happen?</h2>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Country</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setCountry('Malaysia')}
              className={`p-4 border rounded-lg text-center transition-all ${
                country === 'Malaysia'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <span className="font-medium text-gray-800 dark:text-white">Malaysia</span>
            </button>
            <button
              type="button"
              onClick={() => setCountry('Singapore')}
              className={`p-4 border rounded-lg text-center transition-all ${
                country === 'Singapore'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <span className="font-medium text-gray-800 dark:text-white">Singapore</span>
            </button>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Location Details</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
            placeholder="Address, landmark, or description of the location"
          />
        </div>
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 rounded-lg font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={!country || !location}
            className={`px-6 py-3 rounded-lg font-medium ${
              country && location
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>

      {/* Step 4: Media Upload */}
      <div ref={stepRefs.media} className={`${step === 'media' ? 'block' : 'hidden'}`}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add Photos or Videos</h2>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Upload Evidence (Optional)</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*,video/*"
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-700 dark:text-gray-300">Drag and drop files here, or click to select files</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Supports: JPG, PNG, MP4, MOV (Max 10MB each)</p>
              </div>
            </label>
          </div>
        </div>

        {/* Preview uploaded files */}
        {previewUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 rounded-lg font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-3 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Step 5: Review */}
      <div ref={stepRefs.review} className={`${step === 'review' ? 'block' : 'hidden'}`}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Review Your Report</h2>

        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Report Type</h3>
            <p className="text-gray-900 dark:text-white">{reportType}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
            <p className="text-gray-900 dark:text-white">{description}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Location</h3>
            <p className="text-gray-900 dark:text-white">{country}: {location}</p>
          </div>

          {previewUrls.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Uploaded Evidence</h3>
              <div className="grid grid-cols-3 gap-2">
                {previewUrls.map((url, index) => (
                  <img key={index} src={url} alt={`Evidence ${index}`} className="w-full h-16 object-cover rounded" />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 rounded-lg font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-3 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Submit Report
          </button>
        </div>
      </div>

      {/* Step 6: Success */}
      <div ref={stepRefs.success} className={`${step === 'success' ? 'block' : 'hidden'} text-center`}>
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Report Submitted Successfully!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Your report has been submitted to the appropriate authorities in {country}.
          You will receive updates on the status of your report via email.
        </p>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-8">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Report Reference Number</h3>
          <p className="text-xl font-mono text-indigo-600 dark:text-indigo-400">REP-123456</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setStep('type');
            setReportType('');
            setDescription('');
            setLocation('');
            setCountry('');
            setFiles([]);
            setPreviewUrls([]);
          }}
          className="px-6 py-3 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Submit Another Report
        </button>
      </div>
    </div>
  );
};

export default ReportForm;
