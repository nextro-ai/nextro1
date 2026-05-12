import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  isLCP?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  isLCP = false,
  className = '',
  style,
}) => {
  // Para las URLs actuales que ya tienen extensión o parámetros (como unsplash), 
  // no podemos simplemente añadir .avif o .webp al final. 
  // En este caso, haremos un fallback inteligente: si la url es de unsplash o tiene http, 
  // la usamos directamente en el tag img. Si es local sin extensión, usamos source.
  const isExternal = src.startsWith('http') || src.includes('.mp4') || src.includes('.jpg');
  
  return (
    <div 
      className={`relative overflow-hidden bg-zinc-900/20 ${className}`} 
      style={{ 
        ...(width && height ? { aspectRatio: `${width}/${height}` } : {}),
        ...style 
      }}
    >
      {isExternal ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={isLCP ? "eager" : "lazy"}
          decoding={isLCP ? "sync" : "async"}
          {...(isLCP ? { fetchpriority: "high" } : {})}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
      ) : (
        <picture>
          <source srcSet={`${src}.avif`} type="image/avif" />
          <source srcSet={`${src}.webp`} type="image/webp" />
          <img
            src={`${src}.jpg`}
            alt={alt}
            width={width}
            height={height}
            loading={isLCP ? "eager" : "lazy"}
            decoding={isLCP ? "sync" : "async"}
            {...(isLCP ? { fetchpriority: "high" } : {})}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;
