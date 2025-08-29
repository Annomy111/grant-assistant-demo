import React from 'react';

interface OakLeafLogoProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

export const OakLeafLogo: React.FC<OakLeafLogoProps> = ({ 
  className = '', 
  width = 35, 
  height = 45,
  color = '#5A6B66'
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 200 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Exact German-Ukrainian Bureau oak leaf - characteristic lobed shape */}
      <path
        d="M100 15
           C95 18 92 20 88 24
           L82 21 C78 23 75 27 72 30
           L65 27 C61 31 57 35 54 40
           L46 37 C42 42 38 47 35 53
           L27 50 C23 56 20 62 17 69
           L10 67 C7 74 5 81 4 88
           L2 87 C1 94 1 101 2 108
           L4 109 C5 116 7 123 10 130
           L17 128 C20 135 23 141 27 147
           L35 144 C38 150 42 155 46 160
           L54 157 C57 162 61 166 65 170
           L72 167 C75 170 78 174 82 176
           L88 173 C92 177 95 179 100 182
           C105 179 108 177 112 173
           L118 176 C122 174 125 170 128 167
           L135 170 C139 166 143 162 146 157
           L154 160 C158 155 162 150 165 144
           L173 147 C177 141 180 135 183 128
           L190 130 C193 123 195 116 196 109
           L198 108 C199 101 199 94 198 87
           L196 88 C195 81 193 74 190 67
           L183 69 C180 62 177 56 173 50
           L165 53 C162 47 158 42 154 37
           L146 40 C143 35 139 31 135 27
           L128 30 C125 27 122 23 118 21
           L112 24 C108 20 105 18 100 15Z
           
           M100 35 L100 170"
        fill={color === 'white' ? 'white' : '#5A6B66'}
        fillOpacity={color === 'white' ? '0.9' : '1'}
      />
      
      {/* Characteristic oak leaf veins */}
      <g stroke={color === 'white' ? 'white' : '#5A6B66'} strokeWidth="1" strokeOpacity="0.2">
        <path d="M100 50 L75 40" />
        <path d="M100 60 L70 45" />
        <path d="M100 70 L68 52" />
        <path d="M100 80 L67 61" />
        <path d="M100 90 L68 72" />
        <path d="M100 100 L70 84" />
        <path d="M100 110 L72 96" />
        <path d="M100 120 L75 108" />
        <path d="M100 130 L78 119" />
        <path d="M100 140 L82 130" />
        
        <path d="M100 50 L125 40" />
        <path d="M100 60 L130 45" />
        <path d="M100 70 L132 52" />
        <path d="M100 80 L133 61" />
        <path d="M100 90 L132 72" />
        <path d="M100 100 L130 84" />
        <path d="M100 110 L128 96" />
        <path d="M100 120 L125 108" />
        <path d="M100 130 L122 119" />
        <path d="M100 140 L118 130" />
      </g>
    </svg>
  );
};