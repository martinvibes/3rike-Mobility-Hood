
import Faq from "./sections/faq";
import AboutUs from "./sections/about";
import Hero from "./sections/hero";
import Services from "./sections/services";
import Waitlist from "./sections/waitlist";
export default function Landing() {

    return (
        <div className="bg-black">
            <Hero />
            <Waitlist />
            <Services />
            <AboutUs />
            <Faq />
        </div>
    );
}
