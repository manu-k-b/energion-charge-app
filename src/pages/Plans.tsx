import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Check } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  kwh: number;
  price: number;
  popular?: boolean;
}

const plans: Plan[] = [
  { id: "plan1", kwh: 5, price: 250 },
  { id: "plan2", kwh: 10, price: 450, popular: true },
  { id: "plan3", kwh: 20, price: 850 },
  { id: "plan4", kwh: 50, price: 2000 },
];

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePurchase = () => {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing (Razorpay integration would go here)
    setTimeout(() => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        user.remaining = (user.remaining || 0) + selectedPlan.kwh;
        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success("Payment Successful! ⚡", {
        description: `${selectedPlan.kwh} kWh added to your account`,
      });
      setIsProcessing(false);
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Prepaid Plans</h1>
            <p className="text-sm text-muted-foreground">
              Choose a plan and recharge your account
            </p>
          </div>
        </div>

        <div className="grid gap-4 mb-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`p-6 cursor-pointer transition-smooth relative ${
                selectedPlan?.id === plan.id
                  ? "border-primary border-2 shadow-elevated"
                  : "shadow-card hover:shadow-elevated"
              } gradient-card`}
              onClick={() => setSelectedPlan(plan)}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary fill-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{plan.kwh} kWh</h3>
                    <p className="text-sm text-muted-foreground">
                      Prepaid Credits
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    ₹{plan.price}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ₹{(plan.price / plan.kwh).toFixed(0)}/kWh
                  </p>
                </div>

                {selectedPlan?.id === plan.id && (
                  <div className="absolute top-6 right-6 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    Valid for 12 months
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    Use at any Energion charger
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    No hidden charges
                  </li>
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {selectedPlan && (
          <Card className="p-6 shadow-elevated gradient-card">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Selected Plan</span>
                <span className="text-lg font-bold">{selectedPlan.kwh} kWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Amount to Pay</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{selectedPlan.price}
                </span>
              </div>

              <Button
                variant="action"
                size="lg"
                className="w-full"
                onClick={handlePurchase}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing Payment..." : "Proceed to Pay"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Secure payment powered by Razorpay
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Plans;
