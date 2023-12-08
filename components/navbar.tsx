import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import Container from "./ui/container";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
  userId: string;
}

const Navbar: React.FC<NavbarProps> = async ({
  userId,
}) => {

  return ( 
    <div className="fixed top-0 left-0 z-50 right-0 border-b-2 border-b-secondary bg-inherit">
      <Container>
          <div className="w-full relative mx-auto h-16 items-center grid grid-cols-5">
              <div>
                  {/* Logo Link */}
                  <Link href={`/}`} className="font-bold text-2xl transition-all">
                      JAT
                  </Link>
              </div>
              <div className="col-span-3 mx-auto flex h-[2rem] justify-center items-center relative">
                  <div className="grid grid-cols-2 gap-[2.5rem] h-[2rem] my-auto text-sm border-4 bg-white border-slate-200 rounded-2xl items-center">
                      <Link href={`/${userId}/applications`} className="text-right w-[4rem] my-auto text-black hover:text-primary transition-all px-3 font-bold hover:border-primary">
                          Apps
                      </Link>
                      <Link href={`/${userId}/more`} className="text-left w-[4rem] my-auto text-black hover:text-primary transition-all px-3 font-bold hover:border-primary">
                          More
                      </Link>
                  </div>
                  <div className="absolute mx-auto flex items-center justify-center">
                      <Link href={`/`} className="mx-auto z-10 w-[3rem] h-[3rem] text-accent hover:text-accent text-center border-4 border-slate-300 rounded-full bg-white hover:border-primary transition-all">
                          <FontAwesomeIcon icon={faHouseChimney} className="pt-3" />
                      </Link>
                  </div>
              </div>

              <div className="ml-auto flex items-center space-x-4">
                <ThemeToggle />
                <UserButton afterSignOutUrl="/" />
              </div>
          </div>
      </Container>
    </div>
  );
};
 
export default Navbar;
