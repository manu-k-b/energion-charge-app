import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Zap } from "lucide-react";

const Charging = () => {
  const [progress, setProgress] = useState(0);
  const [kwhDelivered, setKwhDelivered] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const targetPercent = location.state?.chargePercent || 100;

  useEffect(() => {
    if (!location.state) {
      navigate("/dashboard");
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= targetPercent) {
          clearInterval(interval);
          setIsComplete(true);
          toast.success("Charging Complete! ⚡", {
            description: "SMS alert sent to your registered mobile number",
          });
          return targetPercent;
        }
        return prev + 1;
      });

      setKwhDelivered((prev) => prev + 0.035);
      setTimeElapsed((prev) => prev + 1);
    }, 100);

    return () => clearInterval(interval);
  }, [navigate, location.state, targetPercent]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs}s`;
  };

  const handleComplete = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-elevated gradient-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {isComplete ? "Charging Complete ⚡" : "Charging in progress..."}
          </h2>
          <Zap className="w-8 h-8 text-primary fill-primary animate-pulse" />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-4" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">kWh delivered</p>
              <p className="text-2xl font-bold text-foreground">
                {kwhDelivered.toFixed(2)}
              </p>
            </div>

            <div className="bg-secondary/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Power draw</p>
              <p className="text-2xl font-bold text-foreground">1.8 kW</p>
            </div>
          </div>

          <div className="bg-secondary/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Time elapsed</p>
            <p className="text-2xl font-bold text-foreground">
              {formatTime(Math.floor(timeElapsed / 10))}
            </p>
          </div>

          {isComplete ? (
            <Button
              variant="action"
              size="lg"
              className="w-full"
              onClick={handleComplete}
            >
              Back to Dashboard
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="lg"
              className="w-full"
              onClick={() => {
                toast.info("Charging stopped");
                navigate("/dashboard");
              }}
            >
              Stop Charging
            </Button>
          )}

          {isComplete && (
            <div className="text-center text-sm text-muted-foreground">
              <p>SMS alert sent to your registered mobile number</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Charging;
