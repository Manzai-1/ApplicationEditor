import Spinner from '@/components/ui/Spinner'

function Callback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Spinner size="lg" />
      <p className="mt-4 text-muted-foreground">Verifying...</p>
    </div>
  )
}

export default Callback
