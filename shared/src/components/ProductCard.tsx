import React, { useState } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatters';
import { IconHeart, IconStar, IconPlus, IconMinus } from '../icons/CustomIcons';

export interface ProductCardProps {
  product: Product;
  quantity?: number;
  onQuantityChange?: (qty: number) => void;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity = 0,
  onQuantityChange,
  onClick,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(!favorite);
    onToggleFavorite?.();
  };

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #E8F2F2',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 6px 20px rgba(74, 183, 182, 0.08)',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
      }}
    >
      {/* Top Controls: Heart on Left, Discount Ribbon on Right */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 2,
      }}>
        {/* Heart Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconHeart
            size={18}
            color={favorite ? '#EA7173' : '#CBD5E1'}
            fill={favorite ? '#EA7173' : 'none'}
          />
        </button>

        {/* Diagonal Ribbon / Pill */}
        {discount > 0 && (
          <span style={{
            backgroundColor: '#EA7173',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '6px',
            letterSpacing: '0.4px',
            boxShadow: '0 2px 6px rgba(234, 113, 115, 0.4)',
          }}>
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Product Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '80%',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500'}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '16px',
            boxSizing: 'border-box',
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 200ms ease',
          }}
        />
        {!imgLoaded && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#F8FAFC',
          }} />
        )}
      </div>

      {/* Card Body */}
      <div style={{
        padding: '12px 14px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        flex: 1,
        gap: '6px',
      }}>
        {/* Title */}
        <h4 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#1E293B',
          margin: 0,
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
        }}>
          {product.name}
        </h4>

        {/* Price & Rating Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: '2px',
        }}>
          <span style={{
            fontSize: '15px',
            fontWeight: 800,
            color: '#1E293B',
            fontFamily: "'Poppins', sans-serif",
          }}>
            {formatCurrency(product.price)}
          </span>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#64748B',
          }}>
            <span>4.8</span>
            <IconStar size={12} color="#FDAA5D" fill="#FDAA5D" />
          </div>
        </div>

        {/* Action Button: Add to Cart vs Stepper */}
        <div style={{ width: '100%', marginTop: '6px' }} onClick={(e) => e.stopPropagation()}>
          {quantity > 0 ? (
            /* HyperMart active pill stepper: Coral background with count & teal plus */
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#EA7173',
              borderRadius: '9999px',
              padding: '3px 6px',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(234, 113, 115, 0.35)',
            }}>
              <button
                onClick={() => onQuantityChange?.(quantity - 1)}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <IconMinus size={14} color="#FFFFFF" strokeWidth={3} />
              </button>

              <span style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: "'Poppins', sans-serif",
              }}>
                {quantity}
              </span>

              <button
                onClick={() => onQuantityChange?.(quantity + 1)}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#4AB7B6',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(74, 183, 182, 0.4)',
                }}
              >
                <IconPlus size={14} color="#FFFFFF" strokeWidth={3} />
              </button>
            </div>
          ) : (
            /* HyperMart default: Outlined Tangerine Pill Button */
            <button
              onClick={() => onQuantityChange?.(1)}
              style={{
                width: '100%',
                padding: '7px 0',
                borderRadius: '9999px',
                border: '1.5px solid #FDAA5D',
                backgroundColor: 'transparent',
                color: '#FDAA5D',
                fontSize: '13px',
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
