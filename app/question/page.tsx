export const dynamic = 'force-dynamic'
import { Settings, Code2, Play } from 'lucide-react'
import { Card } from '@/components/ui/card'
import CodeEditor from '@/components/CodeEditor'
import Header from '@/components/Header'
import IOspace from '@/components/IOspace'
import RunButton from '@/components/RunButton'
import LanguageSelector from '@/components/LanguageSelector'
import { CodeProvider } from '@/providers/CodeProvider'
import { QuestionProvider } from '@/providers/QuestionProvider'
import ProblemStatement from '@/components/ProblemStatement'
import { ResultProvider } from '@/providers/ResultProvider'
import CodenProvider from '@/providers/CodenProvider'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { Toaster } from "@/components/ui/toaster"
import FloatingDock from '@/components/FloatingDock'
import CopyButton from "@/components/CopyButton";


export default function Home() {

  // const [loading,setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-cover bg-center">
      <Header></Header>
      <CodenProvider>
        <RunButton />
        <div className="container mx-auto px-4 py-2 grid lg:grid-cols-2 grid-cols-1 gap-6 h-[calc(100vh-73px)]">
          <ProblemStatement></ProblemStatement>
          <div className="flex flex-col gap-6">
            <Card className="p-4 flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="text-xl font-semibold mb-4">Code Editor</h2>
                <div className='flex gap-2 py-2 items-center'>
                  <LanguageSelector className="mx-auto" />
                  <CopyButton />
                </div>
              </div>
              <div className="mt-4">
                <CodeEditor/>
              </div>
            </Card>
            <IOspace></IOspace>
          </div>
        </div>
        <FloatingDock></FloatingDock>
      </CodenProvider>
      <Toaster />
    </div>
  )
}
