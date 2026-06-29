-- Users profile (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_sv TEXT NOT NULL,
  name_fa TEXT NOT NULL,
  description_en TEXT,
  description_sv TEXT,
  description_fa TEXT,
  duration_minutes INTEGER NOT NULL,
  price_sek DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability (admin sets available slots)
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id),
  availability_id UUID REFERENCES public.availability(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'confirmed', 'cancelled')),
  zoom_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id),
  amount_sek DECIMAL(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('stripe', 'swish')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  swish_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default services
INSERT INTO public.services (name_en, name_sv, name_fa, description_en, description_sv, description_fa, duration_minutes, price_sek)
VALUES
  ('AI Consultation (30 min)', 'AI-konsultation (30 min)', 'مشاوره هوش مصنوعی (۳۰ دقیقه)',
   'Strategic AI session to help your business grow smarter.',
   'Strategisk AI-session för att hjälpa ditt företag växa smartare.',
   'جلسه استراتژیک هوش مصنوعی برای رشد هوشمندتر کسب‌وکار شما.',
   30, 500.00),
  ('AI Consultation (60 min)', 'AI-konsultation (60 min)', 'مشاوره هوش مصنوعی (۶۰ دقیقه)',
   'In-depth AI strategy session for your business.',
   'Djupgående AI-strategisession för ditt företag.',
   'جلسه عمیق استراتژی هوش مصنوعی برای کسب‌وکار شما.',
   60, 900.00);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Services are public" ON public.services FOR SELECT USING (TRUE);
CREATE POLICY "Availability is public" ON public.availability FOR SELECT USING (TRUE);
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (
  auth.uid() = (SELECT user_id FROM public.bookings WHERE id = booking_id)
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
