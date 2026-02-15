export default function LearnItem({ title, description, onClick }) {
   return (
     <div
       onClick={onClick}
       className="p-4 border rounded-lg hover:shadow-md transition bg-white cursor-pointer"
     >
       <h3 className="text-lg font-semibold mb-1">
         {title}
       </h3>
 
       <p className="text-sm text-gray-600">
         {description}
       </p>
     </div>
   );
 }
 