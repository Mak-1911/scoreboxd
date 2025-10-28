import Image from 'next/image';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper'; // Import ScrollAnimationWrapper
import { motion } from 'framer-motion';

const ProductDemo = () => {
    const events = [
        {
            title: "Track User. Follow Them",
            description: "An exhilarating match between two top European teams, showcasing incredible skill and teamwork. The atmosphere was electric as fans witnessed a nail-biting finish.",
            image: "/placeholder-image-1.png"
        },
        {
            title: "Grand Slam Tournament",
            description: "An intense tournament where top-ranked players battled for the coveted title. The final match was a showcase of unmatched skill and endurance.",
            image: "/placeholder-image-2.png"
        },
        {
            title: "NBA Finals",
            description: "A thrilling series that kept fans on the edge of their seats. Both teams displayed phenomenal talent and strategies leading to an unforgettable championship game.",
            image: "/placeholder-image-3.png"
        }
    ];

    return (
        <div className="container mx-auto px-5 py-16">
            <div className="flex justify-center w-full mx-auto">
                <div className="w-[70%]">
                    <ScrollAnimationWrapper
                      preset="smoothFadeUp"
                      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                      className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">Explore Sports Events & Reviews</h2>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">Explore the latest happenings in the sports world and read insightful reviews.</p>
                    </ScrollAnimationWrapper>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {events.map((event, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: index * 0.2 }}
                              viewport={{ once: true }}
                              whileHover={{ 
                                y: -12,
                                scale: 1.02,
                                transition: { duration: 0.3 }
                              }}
                              className="rounded-2xl overflow-hidden transition-all duration-500"
                              style={{
                                backdropFilter: 'blur(4px)',
                                WebkitBackdropFilter: 'blur(4px)',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                                <div className="relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-10"></div>
                                    <Image 
                                        src={event.image} 
                                        alt={event.title}
                                        width={500}
                                        height={300}
                                        className="object-cover w-full h-56 transition-all duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0  transition-all duration-500 "></div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-white">{event.title}</h3>
                                        <span className="text-xs font-semibold bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full backdrop-blur-sm">
                                            NEW
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-base leading-relaxed">{event.description}</p>
                                    
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDemo;