import { Settings, Code2, Play } from 'lucide-react'
import { Button } from '../components/ui/button'
import { ThemeToggle } from './theme-toggle'
import Link from 'next/link'


const Header = () => {
    return(
        <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            
            {/* <h1 className="text-2xl font-bold">Playground</h1> */}
            <Link href="/" className=" flex items-center gap-2 text-2xl font-bold">
              <Code2 className="h-6 w-6" />
              {/* <img
                src="/Coden.png"
                className="w-auto h-full max-h-16"
              >
              </img> */}
              Coden
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {/* <Button variant="outline">Sign Up</Button> */}
            {/* <Button>Login</Button> */}
            <ThemeToggle />
            {/* <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button> */}
          </div>
        </div>
      </header>
    )
}

export default Header;