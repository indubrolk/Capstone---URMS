import { SupabaseClient } from "@supabase/supabase-js";

export const sendNotification = async (supabase: SupabaseClient, userId: string, message: string, type: string = 'info') => {
    try {
        const { error } = await supabase
            .from('notifications')
            .insert([{
                user_id: userId,
                message,
                type,
                timestamp: new Date().toISOString()
            }]);
        
        if (error) throw error;
        console.log(`Notification sent to ${userId}: ${message}`);
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};

export const logEmailDelivery = (recipient: string, subject: string, body: string, attachmentName?: string) => {
    console.log(`
======== MOCK EMAIL DELIVERY ========
To: ${recipient}
Subject: ${subject}
Attachment: ${attachmentName || 'None'}
-------------------------------------
${body}
=====================================
`);
};
