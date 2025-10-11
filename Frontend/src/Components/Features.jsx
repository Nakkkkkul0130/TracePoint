import { motion } from "framer-motion";
import { UserPlus, Upload, MessageSquare, CheckCircle, Shield, Clock } from "lucide-react";

export default function Features() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Account",
      description: "Sign up for free and join our community of helpful users",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Upload,
      title: "Report Item",
      description: "Upload photos and details of your lost or found items",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: MessageSquare,
      title: "Connect & Chat",
      description: "Chat securely with item owners or finders in real-time",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Verification",
      description: "Advanced verification system to ensure legitimate claims",
      color: "text-blue-600"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get instant notifications when matching items are found",
      color: "text-purple-600"
    },
    {
      icon: CheckCircle,
      title: "Success Tracking",
      description: "Track your reports and successful reunions",
      color: "text-green-600"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Why Choose TracePoint?</span>
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our platform offers advanced features to make finding lost items easier and more secure than ever.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="card p-6 text-center group hover:shadow-2xl"
              >
                <div className="inline-flex p-3 rounded-xl bg-gray-100 dark:bg-gray-700 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
