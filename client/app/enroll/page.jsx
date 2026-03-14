'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Calendar } from 'lucide-react';

const COURSES = {
  begena: { name: 'Begena Course', price: 89, duration: '8 weeks', students: 'Up to 15', description: 'Learn the ancient Ethiopian harp with 10-13 strings. Master traditional techniques and spiritual music.' },
  kirar: { name: 'Kirar Course', price: 69, duration: '6 weeks', students: 'Up to 20', description: 'Learn the traditional 5-10 stringed Ethiopian lyre. Perfect for beginners and intermediate players.' }
};

const SCHEDULES = {
  begena: ['Monday & Wednesday (7 PM)', 'Saturday & Sunday (10 AM)', 'Tuesday & Thursday (6 PM)'],
  kirar: ['Tuesday & Thursday (8 PM)', 'Saturday (2 PM)', 'Wednesday & Friday (7 PM)']
};

export default function EnrollPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addEnrollment } = useCart();

  const [step, setStep] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experience: 'beginner',
    instrument: 'kirar',
    paymentMethod: 'telebirr',
    referenceNumber: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const course = searchParams.get('course');
    if (course && COURSES[course]) setSelectedCourse(course);
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !selectedCourse) newErrors.course = 'Please select a course';
    if (step === 2 && !selectedSchedule) newErrors.schedule = 'Please select a schedule';
    if (step === 3) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
    }
    if (step === 4 && !formData.referenceNumber) {
      newErrors.referenceNumber = 'Transaction reference number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => { if (validateStep()) setStep(step + 1); };
  const handlePrevStep = () => setStep(step - 1);

  const handleEnroll = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setApiError('');

    const enrollPayload = {
      course: selectedCourse,
      course_name: COURSES[selectedCourse].name,
      course_price: COURSES[selectedCourse].price,
      schedule: selectedSchedule,
      student_name: `${formData.firstName} ${formData.lastName}`,
      student_email: formData.email,
      student_phone: formData.phone,
      experience: formData.experience,
      instrument: formData.instrument,
      payment_method: formData.paymentMethod,
      payment_reference: formData.referenceNumber,
      start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    try {
      const { createEnrollment } = await import('@/lib/api');
      const response = await createEnrollment(enrollPayload);

      addEnrollment({
        id: response.data.id || response.data.enrollmentId || Date.now().toString(),
        enrollDate: response.data.enroll_date || new Date().toISOString(),
        status: response.data.status || 'enrolled',
        course: enrollPayload.course,
        courseName: enrollPayload.course_name,
        coursePrice: enrollPayload.course_price,
        schedule: enrollPayload.schedule,
        studentName: enrollPayload.student_name,
        studentEmail: enrollPayload.student_email,
        studentPhone: enrollPayload.student_phone,
        experience: enrollPayload.experience,
        instrument: enrollPayload.instrument,
        paymentMethod: enrollPayload.payment_method,
        paymentReference: enrollPayload.payment_reference,
        startDate: enrollPayload.start_date,
      });

      router.push('/enrollmentconfirmation');
    } catch (error) {
      console.error('Enrollment failed:', error);
      if (error.code === 'ERR_NETWORK' || !error.response) {
        setApiError('Cannot connect to the server. Make sure Django is running on port 8000.');
      } else if (error.response?.data) {
        const detail = error.response.data.detail || JSON.stringify(error.response.data);
        setApiError(`Server error: ${detail}`);
      } else {
        setApiError('Enrollment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full"></div>
              <span className="text-xl font-serif font-bold text-foreground">Kidus Online</span>
            </Link>
            <Link href="/"><Button variant="outline">Back to Home</Button></Link>
          </div>
        </div>
      </nav>

      {/* Enrollment */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">

          {/* API Error Banner */}
          {apiError && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/40 rounded-lg flex items-start gap-3">
              <span className="text-destructive text-lg leading-none mt-0.5">⚠</span>
              <div>
                <p className="text-destructive font-semibold text-sm">Enrollment Failed</p>
                <p className="text-destructive/80 text-xs mt-1">{apiError}</p>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: step >= s ? 'var(--primary)' : 'var(--secondary)', color: step >= s ? 'white' : 'var(--foreground)' }}>
                {s}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">

                {/* Step 1 — Course Selection */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-foreground">Select Your Course</h2>
                    <p className="text-muted-foreground">Choose the course level that matches your experience</p>
                    <div className="space-y-4">
                      {Object.entries(COURSES).map(([key, course]) => (
                        <div key={key} onClick={() => setSelectedCourse(key)} className={`p-6 border-2 rounded-lg cursor-pointer transition ${selectedCourse === key ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'}`}>
                          <h3 className="text-lg font-semibold text-foreground mb-2">{course.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Duration: {course.duration}</p>
                            <p>Class size: {course.students}</p>
                            <p className="font-bold text-primary mt-2">${course.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.course && <p className="text-destructive text-sm">{errors.course}</p>}
                  </div>
                )}

                {/* Step 2 — Schedule */}
                {step === 2 && selectedCourse && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-foreground">Select Schedule</h2>
                    <p className="text-muted-foreground">Choose your preferred class time</p>
                    <div className="space-y-3">
                      {SCHEDULES[selectedCourse].map((schedule, idx) => (
                        <div key={idx} onClick={() => setSelectedSchedule(schedule)} className={`p-4 border-2 rounded-lg cursor-pointer transition flex items-center gap-4 ${selectedSchedule === schedule ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'}`}>
                          <Calendar className="w-5 h-5 text-primary" />
                          <span className="font-semibold text-foreground">{schedule}</span>
                        </div>
                      ))}
                    </div>
                    {errors.schedule && <p className="text-destructive text-sm">{errors.schedule}</p>}
                  </div>
                )}

                {/* Step 3 — Personal Info */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-foreground">Personal Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="John" />
                        {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="Doe" />
                        {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="john@example.com" />
                      {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="+1234567890" />
                      {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Experience Level</label>
                      <select name="experience" value={formData.experience} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                        <option value="beginner">Beginner - No prior experience</option>
                        <option value="intermediate">Intermediate - Some experience</option>
                        <option value="advanced">Advanced - Experienced player</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Interested Instrument</label>
                      <select name="instrument" value={formData.instrument} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                        <option value="kirar">Kirar</option>
                        <option value="begena">Begena</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 4 — Confirm */}
                {step === 4 && selectedCourse && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-foreground">Confirm & Pay</h2>
                    <p className="text-muted-foreground">Please review your enrollment details and provide payment info.</p>
                    <Card className="p-6 bg-secondary/50">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Course</p>
                          <p className="font-bold text-foreground text-lg">{COURSES[selectedCourse].name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Schedule</p>
                          <p className="font-semibold text-foreground">{selectedSchedule}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                          <div>
                            <p className="text-sm text-muted-foreground">Student Name</p>
                            <p className="font-semibold text-foreground">{formData.firstName} {formData.lastName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-semibold text-foreground">{formData.email}</p>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground">Total Price</p>
                          <p className="text-2xl font-bold text-primary">${COURSES[selectedCourse].price}</p>
                        </div>
                      </div>
                    </Card>

                    <div className="bg-secondary/50 p-6 rounded-lg mb-6 border border-border mt-6">
                      <p className="font-semibold text-foreground mb-4">Please transfer the total amount to one of our accounts:</p>

                      <div className="space-y-4">
                        <div className="p-4 bg-background rounded-md border border-primary/20">
                          <p className="font-bold text-primary">Telebirr Configuration</p>
                          <p className="text-foreground font-mono text-lg tracking-wider">0911 23 45 67</p>
                          <p className="text-sm text-muted-foreground">Name: Kidus Online Store</p>
                        </div>

                        <div className="p-4 bg-background rounded-md border border-primary/20">
                          <p className="font-bold text-primary">CBE Birr (Commercial Bank)</p>
                          <p className="text-foreground font-mono text-lg tracking-wider">1000 1234 56789</p>
                          <p className="text-sm text-muted-foreground">Name: Kidus Online Store</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Payment Method Used</label>
                      <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                        <option value="telebirr">Telebirr</option>
                        <option value="cbe">CBE Birr</option>
                        <option value="bank_transfer">Other Bank Transfer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Transaction Reference Number</label>
                      <input type="text" name="referenceNumber" value={formData.referenceNumber} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="e.g. FT210..." />
                      {errors.referenceNumber && <p className="text-destructive text-sm mt-1">{errors.referenceNumber}</p>}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8">
                  {step > 1 && (
                    <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10" onClick={handlePrevStep} disabled={loading}>
                      Back
                    </Button>
                  )}
                  <Button className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-60" onClick={step === 4 ? handleEnroll : handleNextStep} disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Enrolling…
                      </span>
                    ) : step === 4 ? 'Complete Enrollment' : 'Next'}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Sidebar Summary */}
            <div>
              {selectedCourse && (
                <Card className="p-6 sticky top-20">
                  <h3 className="text-xl font-serif font-bold text-foreground mb-6">Enrollment Summary</h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Course</p>
                      <p className="font-semibold text-foreground">{COURSES[selectedCourse].name}</p>
                      <p className="text-xs text-muted-foreground mt-2">{COURSES[selectedCourse].description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Duration</p>
                      <p className="font-semibold text-foreground">{COURSES[selectedCourse].duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Class Size</p>
                      <p className="font-semibold text-foreground">{COURSES[selectedCourse].students}</p>
                    </div>
                    {selectedSchedule && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Schedule</p>
                        <p className="font-semibold text-foreground">{selectedSchedule}</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-border pt-6">
                    <p className="text-sm text-muted-foreground mb-2">Total Price</p>
                    <p className="text-3xl font-bold text-primary">${COURSES[selectedCourse].price}</p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-3">What&apos;s Included</h4>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li>✓ Live online classes</li>
                      <li>✓ Video recordings</li>
                      <li>✓ Learning materials</li>
                      <li>✓ Certificate upon completion</li>
                      <li>✓ Email support</li>
                    </ul>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
