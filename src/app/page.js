import AreasOfExpertise from "./component/home/areas";
import Herohome from "./component/home/herohome";
import FeaturedLawyers from "./component/home/FeaturedLawyers";
import Testimonials from "./component/home/Testimonials";

export default function Home() {
  return (
    <div>
      <Herohome />
      <AreasOfExpertise />
      <FeaturedLawyers />
      <Testimonials />
    </div>
  );
}
