import React from "react";

const Box = ({ head, date, spec, desc, skills, score }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow mb-4">
      <div className="flex justify-between items-start mb-2">
        <h5 className="text-lg font-bold text-gray-900">{head}</h5>
        <span className="text-sm text-gray-500 whitespace-nowrap">{date}</span>
      </div>

      {spec && <div className="text-blue-600 font-medium text-sm mb-2">{spec}</div>}

      {desc && <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>}

      {skills && skills.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills Used:</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {score && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-sm font-medium text-gray-700">Grade / Percentage: <span className="text-gray-900">{score}</span></span>
        </div>
      )}
    </div>
  );
};

export default Box;
