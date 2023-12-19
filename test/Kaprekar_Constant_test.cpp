#include<bits/stdc++.h>
#include<gtest/gtest.h>
#include "../lib/header.h"
using namespace std;

TEST(Kaprekar_Constant,partitionOfDigits){
    vector<long long int> digitOfNumber {4,5,6,3}; 
    int result = partitionOfDigits(digitOfNumber,0,3);
    std::cout <<"result : "<< result << std::endl;
    EXPECT_EQ(0,result);
}

TEST(Kaprekar_Constant,sortDigits){
    vector<long long int> digitOfNumber {9,8,7,6,5,4,3,2,1};
    vector<long long int> sortedVector = sortDigits(digitOfNumber);
    for (int i = digitOfNumber.size() - 1; i >= 0; i--)
    {
        EXPECT_EQ(digitOfNumber[i],sortedVector[(digitOfNumber.size() - 1) - i]);
    }
}

TEST(Kaprekar_Constant,convertNumberIntoVector){
    vector<long long int> fourDigitNumber {3,4,6,5};
    vector<long long int> digitOfNumber = convertNumberIntoVector(5643);
    for (int i = 0; i < digitOfNumber.size(); i++)
    {
        EXPECT_EQ(fourDigitNumber[i],digitOfNumber[i]);
    }
    
}

TEST(Kaprekar_Constant,arrangeInAsscendingOrder){
    long long int fourDigitNumber = arrangeInAsscendingOrder(5643);
    EXPECT_EQ(fourDigitNumber,3456);
}

TEST(Kaprekar_Constant,arrangeInDescendingOrder){
    long long int fourDigitNumber = arrangeInDescendingOrder(5643);
    EXPECT_EQ(fourDigitNumber,6543);
}