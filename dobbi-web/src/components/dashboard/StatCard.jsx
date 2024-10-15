import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const StatCard = ({ title, value, icon: Icon, subtext, color }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4" style={{ color }} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{subtext}</p>
            </CardContent>
        </Card>
    </motion.div>
);

export default StatCard;