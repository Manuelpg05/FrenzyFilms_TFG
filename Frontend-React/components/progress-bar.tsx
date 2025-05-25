import { CheckCircle } from "lucide-react"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const steps = [
    { id: 1, name: "Selección de sesión" },
    { id: 2, name: "Selección de butacas" },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                step.id < currentStep
                  ? "border-green-500 bg-green-500 text-white"
                  : step.id === currentStep
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-gray-700 bg-gray-800 text-gray-400"
              }`}
            >
              {step.id < currentStep ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            <span className={`mt-2 text-sm font-medium ${step.id <= currentStep ? "text-white" : "text-gray-500"}`}>
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-10 h-0.5 w-[calc(100%-2.5rem)] ${
                  step.id < currentStep ? "bg-green-500" : "bg-gray-700"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
