import { Quote, Star } from "lucide-react";
// import Image from "next/image";

const Testimonials = () => {
  return (
    <section className="bg-accent/30 py-12 px-8 my-12 space-y-8">
      <h2 className="text-2xl text-center text-accent-foreground font-bold">
        What Our Customers Say
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-50 relative">
          <div className="absolute -top-4 left-10 w-8 h-8 bg-[#B88E2F] rounded-full flex items-center justify-center">
            <Quote className="text-white w-4 h-4" />
          </div>
          <div className="flex gap-1 text-[#FFC107] mb-6">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
          </div>
          <p className="text-[#616161] leading-relaxed mb-8 italic">
            "The quality of the dining table we purchased is exceptional. It has
            become the centerpiece of our home. Truly master craftsmanship."
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              {/* <Image
                  src="https://i.pravatar.cc/150?u=1"
                  alt="User"
                  className="w-full h-full object-cover"
                /> */}
            </div>
            <div>
              <h4 className="font-bold text-[#3A3A3A]">Sarah Jenkins</h4>
              <p className="text-xs text-gray-400">Interior Designer</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-50 relative">
          <div className="absolute -top-4 left-10 w-8 h-8 bg-[#B88E2F] rounded-full flex items-center justify-center">
            <Quote className="text-white w-4 h-4" />
          </div>
          <div className="flex gap-1 text-[#FFC107] mb-6">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
          </div>
          <p className="text-[#616161] leading-relaxed mb-8 italic">
            "Fast delivery and the assembly team was so professional. The sofa
            is incredibly comfortable and looks better than in the photos!"
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              {/* <Image
                  src="https://i.pravatar.cc/150?u=2"
                  alt="User"
                  className="w-full h-full object-cover"
                /> */}
            </div>
            <div>
              <h4 className="font-bold text-[#3A3A3A]">Michael Chen</h4>
              <p className="text-xs text-gray-400">Home Owner</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-50 relative">
          <div className="absolute -top-4 left-10 w-8 h-8 bg-[#B88E2F] rounded-full flex items-center justify-center">
            <Quote className="text-white w-4 h-4" />
          </div>
          <div className="flex gap-1 text-[#FFC107] mb-6">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-currentCover" />
          </div>
          <p className="text-[#616161] leading-relaxed mb-8 italic">
            "I love the sustainable approach. Knowing my bed frame was ethically
            sourced makes me sleep even better. Highly recommended!"
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              {/* <Image
                  src="https://i.pravatar.cc/150?u=3"
                  alt="User"
                  className="w-full h-full object-cover"
                /> */}
            </div>
            <div>
              <h4 className="font-bold text-[#3A3A3A]">Emma Wilson</h4>
              <p className="text-xs text-gray-400">Sustainable Advocate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
